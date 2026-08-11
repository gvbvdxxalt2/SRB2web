// Emacs style mode select   -*- C++ -*-
//-----------------------------------------------------------------------------
//
// Copyright (C) 1993-1996 by id Software, Inc.
// Portions Copyright (C) 1998-2000 by DooM Legacy Team.
//
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License
// as published by the Free Software Foundation; either version 2
// of the License, or (at your option) any later version.
//-----------------------------------------------------------------------------


#include "../doomdef.h"
#include "../i_system.h"
#include "../d_event.h"
#include "../netcode/d_net.h"
#include "../m_argv.h"
#include "../doomstat.h"
#include "../netcode/i_net.h"
#include "../z_zone.h"
#include "../netcode/i_tcp.h"
#include "../netcode/net_command.h"
#include "../netcode/d_clisrv.h"

#ifdef HAVE_SDL

// =========================================================================
// EMSCRIPTEN / WEBSOCKET DEFINITIONS
// =========================================================================
#ifdef EMSCRIPTEN
#include <emscripten.h>
#include <stdio.h> 

#define MAX_QUEUED_PACKETS 7000
#define MAX_PACKET_SIZE 7000

typedef struct {
    unsigned char data[MAX_PACKET_SIZE];
    int length;
    int from_node_id; 
    char from_ip[64]; 
} ws_packet_t;

static volatile ws_packet_t packet_queue[MAX_QUEUED_PACKETS];
static volatile int queue_head = 0;
static volatile int queue_tail = 0;

static int NextIndex(int index) { return (index + 1) % MAX_QUEUED_PACKETS; }

static unsigned int StringToAddr(const char* ip) {
    unsigned int a, b, c, d;
    if (!ip || !*ip) return 0;
    if (sscanf(ip, "%u.%u.%u.%u", &a, &b, &c, &d) != 4) return 0;
    return (a << 24) | (b << 16) | (c << 8) | d;
}

// -------------------------------------------------------------------------
// EXPORTED FUNCTION: JS CALLS THIS
// -------------------------------------------------------------------------
EMSCRIPTEN_KEEPALIVE
void SRB2_NetworkReceive(char *data, int length, int from_id, char *from_ip) {
    int next_head = NextIndex(queue_head);
    if (next_head == queue_tail) return; 

    if (length > MAX_PACKET_SIZE) length = MAX_PACKET_SIZE;
    
    memcpy((void*)packet_queue[queue_head].data, data, length);
    packet_queue[queue_head].length = length;
    packet_queue[queue_head].from_node_id = from_id;
    
    if (from_ip) {
        strncpy((char*)packet_queue[queue_head].from_ip, from_ip, 63);
        packet_queue[queue_head].from_ip[63] = '\0';
    } else {
        packet_queue[queue_head].from_ip[0] = '\0';
    }
    
    queue_head = next_head;
}

extern void SRB2_NetworkSend(int node_id, void* data, int length);
extern int SRB2_ListenOn(int port);
extern int SRB2_CloseSocket(void);
extern int SRB2_GetPort(void);
extern int SRB2_InitNetwork(void);
extern int SRB2_ConnectTo(const char* addr, char* port);

#endif

#ifdef HAVE_SDLNET

#ifdef EMSCRIPTEN
typedef struct {
    unsigned int host;    
    unsigned short port; 
    unsigned int relayid; 
    char ip[64];
    char reason[256]; // Added for ban reasons
} IPaddress;

typedef struct {
    int channel;
    unsigned char *data;
    int len;
    int maxlen;
    int status;
    IPaddress address;
} UDPpacket;

typedef void* UDPsocket;
typedef void* SDLNet_SocketSet;

#define INADDR_BROADCAST 0xFFFFFFFF
#define MAXPACKETLENGTH 6000
#define SOCK_PORT 5029
#else
#include "SDL_net.h"
#endif

#define MAXBANS 30

static boolean nodeconnected[MAXNETNODES+1];
static UINT16 sock_port = 5029;
static INT32 net_bandwidth;
static IPaddress clientaddress[MAXNETNODES+1];
static IPaddress banned[MAXBANS];
static UDPpacket mypacket;
static UDPsocket mysocket = NULL;
static SDLNet_SocketSet myset = NULL;
static size_t numbans = 0;
static boolean NET_bannednode[MAXNETNODES+1];
static boolean init_SDLNet_driver = false;

// -------------------------------------------------------------------------
// Helper Functions
// -------------------------------------------------------------------------

static const char *NET_AddrToStr(IPaddress* sk)
{
#ifdef EMSCRIPTEN
    if (sk->ip[0]) return sk->ip;
    static char s[32];
    sprintf(s, "RelayID-%u", sk->relayid);
    return s;
#else
    static char s[22];
    strcpy(s, SDLNet_ResolveIP(sk));
    if (sk->port != 0) {
        char portstr[10];
        sprintf(portstr, ":%d", sk->port);
        strcat(s, portstr);
    }
    return s;
#endif
}

static const char *NET_GetNodeAddress(INT32 node)
{
    if (!nodeconnected[node]) return NULL;
    return NET_AddrToStr(&clientaddress[node]);
}

static const char *NET_GetBanAddress(size_t ban)
{
    if (ban > numbans) return NULL;
    return NET_AddrToStr(&banned[ban]);
}

static boolean NET_cmpaddr(IPaddress* a, IPaddress* b)
{
#ifdef EMSCRIPTEN
    if (a->host == 0 || b->host == 0) return false;
    return (a->host == b->host);
#else
    if (a->host == b->host && a->port == b->port) return true;
    return false;
#endif
}

static boolean NET_CanGet(void)
{
#ifdef EMSCRIPTEN
    return (queue_head != queue_tail);
#else
    return myset?(SDLNet_CheckSockets(myset,0)  == 1):false;
#endif
}

// -----------------------------------------------------------------------

#ifdef EMSCRIPTEN
static INT32 NET_WebToNode(INT32 relayid)
{
    if (!server) {
        if (!nodeconnected[1]) {
            nodeconnected[1] = true;
            clientaddress[1].relayid = relayid;
        }
        return 1; 
    }

    for (INT32 i = 1; i < MAXNETNODES; i++) {
        if (nodeconnected[i] && clientaddress[i].relayid == (unsigned int)relayid) return i;
    }

    INT32 newnode = -1;
    for (INT32 i = 1; i < MAXNETNODES; i++) {
        if (!nodeconnected[i]) { newnode = i; break; }
    }

    if (newnode != -1) {
        memset(&clientaddress[newnode], 0, sizeof(IPaddress));
        clientaddress[newnode].relayid = relayid;
        clientaddress[newnode].host = 0; 
        clientaddress[newnode].reason[0] = '\0';
        nodeconnected[newnode] = true; 
        NET_bannednode[newnode] = false; 
        return newnode;
    }
    return -1; 
}

EMSCRIPTEN_KEEPALIVE
void SRB2_NetworkClosed(int relay_id) {
    if (!server) return; 
    int node = -1;
    for (INT32 i = 1; i < MAXNETNODES; i++) {
        if (nodeconnected[i] && clientaddress[i].relayid == (unsigned int)relay_id) {
            node = i; break;
        }
    }
    if (node == -1) return;
    
    //CONS_Printf("SRB2: Connection Closed for Node %d", node);
    
    if (netnodes[node].ingame && netnodes[node].player) SendKicksForNode(node, KICK_MSG_PLAYER_QUIT | KICK_MSG_KEEP_BODY); 
    Net_CloseConnection(node);
    netnodes[node].ingame = false;
    netnodes[node].player = -1;
    nodeconnected[node] = false;
    NET_bannednode[node] = false;
}
#endif

// -----------------------------------------------------------------------
// NET_Get: IP SAFETY LOCK & SILENT BAN CHECK
// -----------------------------------------------------------------------
static boolean NET_Get(void)
{
#ifdef EMSCRIPTEN
    if (queue_head == queue_tail) {
        doomcom->remotenode = -1;
        return false;
    }

    int tail = queue_tail;
    ws_packet_t *pkt = (ws_packet_t*)&packet_queue[tail];
    INT32 node = NET_WebToNode(pkt->from_node_id);

    if (!server) {
        node = 1; //Server is ALWAYS 1 when client connecting.
    }

    if (node != -1)
    {
        // =========================================================
        // FIX: IP SAFETY LOCK
        // Only update the IP if the packet contains a valid non-empty string.
        // This prevents the "RelayID-0" ban bug and the rejoin corruption.
        // =========================================================
        if (pkt->from_ip[0] != '\0') {
            
            unsigned int new_host = StringToAddr((char*)pkt->from_ip);

            if (new_host != 0) {
                // If this is a new IP for this node, update it.
                if (clientaddress[node].host != new_host) {
                     char logbuf[256];
                     strncpy(clientaddress[node].ip, (char*)pkt->from_ip, 63);
                     clientaddress[node].ip[63] = '\0';
                     clientaddress[node].host = new_host;

                     sprintf(logbuf, "Node %d IP Update: %s", node, clientaddress[node].ip);
                     //CONS_Printf("%s", logbuf);
                }
            }
        }
        // =========================================================

        // Check Ban on every packet silently
        for (size_t i = 0; i < numbans; i++) {
            if (NET_cmpaddr(&clientaddress[node], &banned[i])) {
                // Ban Match Found - Enforce Kick
                NET_bannednode[node] = true; 
                break;
            }
        }

        mypacket.len = pkt->length;
        memcpy(mypacket.data, pkt->data, pkt->length);
        
        mypacket.address.relayid = pkt->from_node_id;
        
        // Always use the stored SAFE IP
        mypacket.address.host = clientaddress[node].host;
        strncpy(mypacket.address.ip, clientaddress[node].ip, 63);

        doomcom->remotenode = node;
        doomcom->datalength = mypacket.len;
        
        queue_tail = NextIndex(tail);
        return true;
    }
    
    queue_tail = NextIndex(tail);
    doomcom->remotenode = -1;
    return false;
#else
    // Desktop Code
    if (!NET_CanGet()) {
        doomcom->remotenode = -1;
        return false;
    }
    if (SDLNet_UDP_Recv(mysocket,&mypacket)) {
        INT32 i;
        doomcom->remotenode = -1;
        for (i=0; i<MAXNETNODES; i++) {
            if (NET_cmpaddr(&mypacket.address,&clientaddress[i])) {
                doomcom->remotenode = i;
                break;
            }
        }
        if (doomcom->remotenode == -1) doomcom->remotenode = MAXNETNODES; 
        doomcom->datalength = mypacket.len;
        return true;
    }
    return false;
#endif
}

static void NET_Send(void)
{
    if (!doomcom->remotenode) return;
    mypacket.len = doomcom->datalength;

#ifdef EMSCRIPTEN
    if (doomcom->remotenode < 0 || doomcom->remotenode >= MAXNETNODES) return;
    int target_relay_id = clientaddress[doomcom->remotenode].relayid;
    SRB2_NetworkSend(target_relay_id, mypacket.data, mypacket.len);
#else
    if (SDLNet_UDP_Send(mysocket,doomcom->remotenode-1,&mypacket) == 0)
        I_OutputMsg("SDL_Net: %s",SDLNet_GetError());
#endif
}

static void NET_FreeNodenum(INT32 numnode)
{
    if (!numnode) return;
#ifndef EMSCRIPTEN
    SDLNet_UDP_Unbind(mysocket,numnode-1);
#endif
    memset(&clientaddress[numnode], 0, sizeof (IPaddress));
    nodeconnected[numnode] = false; 
    NET_bannednode[numnode] = false;
}

static UDPsocket NET_Socket(void)
{
#ifdef EMSCRIPTEN
    static int dummy_socket;
    return (UDPsocket)&dummy_socket;
#else
    UDPsocket temp = NULL;
    Uint16 portnum = 0;
    IPaddress tempip = {INADDR_BROADCAST,0};
    if (M_CheckParm("-clientport")) {
        if (!M_IsNextParm()) I_Error("syntax: -clientport <portnum>");
        portnum = atoi(M_GetNextParm());
    } else portnum = sock_port;
    temp = SDLNet_UDP_Open(portnum);
    if (!temp) return NULL;
    if (SDLNet_UDP_Bind(temp,BROADCASTADDR-1,&tempip) == -1) {
        SDLNet_UDP_Close(temp);
        return NULL;
    }
    clientaddress[BROADCASTADDR].port = sock_port;
    clientaddress[BROADCASTADDR].host = INADDR_BROADCAST;
    doomcom->extratics = 1; 
    return temp;
#endif
}

static void I_ShutdownSDLNetDriver(void)
{
#ifndef EMSCRIPTEN
    if (myset) SDLNet_FreeSocketSet(myset);
    myset = NULL;
    SDLNet_Quit();
#endif
    init_SDLNet_driver = false;
}

static void I_InitSDLNetDriver(void)
{
    if (init_SDLNet_driver) I_ShutdownSDLNetDriver();
#ifndef EMSCRIPTEN
    if (SDLNet_Init() == -1) return; 
#endif
    D_SetDoomcom();
    mypacket.data = doomcom->data;
    init_SDLNet_driver = true;
}

static void NET_CloseSocket(void)
{
#ifdef EMSCRIPTEN
    SRB2_CloseSocket();
    mysocket = NULL;
#endif
#ifndef EMSCRIPTEN
    if (mysocket) SDLNet_UDP_Close(mysocket);
#endif
    mysocket = NULL;
}

EMSCRIPTEN_KEEPALIVE
void SRB2_ForceCloseSocket(void) { NET_CloseSocket(); }

static SINT8 NET_NetMakeNodewPort(const char *hostname, const char *port)
{
    INT32 newnode;
    IPaddress hostnameIP;

#ifdef EMSCRIPTEN
    if (SRB2_ConnectTo(hostname, port) != 0) return -1;
    newnode = 1; 
    hostnameIP.relayid = hostname ? atoi(hostname) : 0;
    hostnameIP.port = 0;
    if (hostname) {
        strncpy(hostnameIP.ip, hostname, 63);
        hostnameIP.ip[63] = '\0';
        hostnameIP.host = StringToAddr(hostname);
    } else {
        hostnameIP.ip[0] = '\0';
        hostnameIP.host = 0;
    }
    M_Memcpy(&clientaddress[newnode], &hostnameIP, sizeof(IPaddress));
    nodeconnected[newnode] = true; 
    NET_bannednode[newnode] = false;
    return (SINT8)newnode;
#else
    UINT16 portnum = sock_port;
    if (port && !port[0]) portnum = atoi(port);
    if (SDLNet_ResolveHost(&hostnameIP,hostname,portnum) == -1) return -1;
    newnode = SDLNet_UDP_Bind(mysocket,-1,&hostnameIP);
    if (newnode == -1) return newnode;
    newnode++;
    M_Memcpy(&clientaddress[newnode],&hostnameIP,sizeof (IPaddress));
    return (SINT8)newnode;
#endif
}

static boolean NET_OpenSocket(void)
{
    memset(clientaddress, 0, sizeof (clientaddress));
    for(int i=0; i<MAXNETNODES+1; i++) {
        nodeconnected[i] = false;
        NET_bannednode[i] = false;
    }

    I_NetSend = NET_Send;
    I_NetGet = NET_Get;
    I_NetCloseSocket = NET_CloseSocket;
    I_NetFreeNodenum = NET_FreeNodenum;
    I_NetMakeNodewPort = NET_NetMakeNodewPort;

    NET_CloseSocket();
    mysocket = NET_Socket();

    #ifdef EMSCRIPTEN
        if (server) SRB2_ListenOn(sock_port);
    #endif

    if (!mysocket) return false;
#ifndef EMSCRIPTEN
    myset = SDLNet_AllocSocketSet(1);
    if (!myset) return false;
    if (SDLNet_UDP_AddSocket(myset,mysocket) == -1) return false;
#endif
    return true;
}

// -------------------------------------------------------------------------
// NET_Ban
// -------------------------------------------------------------------------
static boolean NET_Ban(INT32 node)
{
    if (numbans == MAXBANS) return false;
    M_Memcpy(&banned[numbans], &clientaddress[node], sizeof (IPaddress));
    banned[numbans].port = 0;
    
    // Default reason (since I_Ban doesn't accept arguments)
#ifdef EMSCRIPTEN
    strcpy(banned[numbans].reason, "Manual Ban"); 
#endif

    numbans++;
    return true;
}

static boolean NET_SetBanAddress(const char *address, const char *mask)
{
    (void)mask;
    if (numbans == MAXBANS) return false;
#ifdef EMSCRIPTEN
    strncpy(banned[numbans].ip, address, 63);
    banned[numbans].ip[63] = '\0';
    banned[numbans].host = StringToAddr(address); 
    banned[numbans].relayid = 0; 
    banned[numbans].port = 0;
    
    // Default reason for bans loaded from file
    banned[numbans].reason[0] = '\0'; 

    //CONS_Printf("Driver Loaded Ban: %s\n", banned[numbans].ip);

    numbans++;
    return true;
#else
    if (SDLNet_ResolveHost(&banned[numbans], address, 0) == -1) return false;
    numbans++;
    return true;
#endif
}

static void NET_ClearBans(void)
{
    numbans = 0;
}
#endif

boolean I_InitNetwork(void)
{
#ifdef HAVE_SDLNET
    char serverhostname[255];
    boolean ret = false;
    I_InitSDLNetDriver();
    I_AddExitFunc(I_ShutdownSDLNetDriver);
    if (!init_SDLNet_driver) return false;
#ifdef EMSCRIPTEN
    SRB2_InitNetwork();
#endif
    if (M_CheckParm("-udpport")) {
        if (M_IsNextParm()) sock_port = (UINT16)atoi(M_GetNextParm());
        else sock_port = 0;
    }
    // parse network game options,
	if (M_CheckParm("-server") || dedicated)
	{
		server = true;

		// If a number of clients (i.e. nodes) is specified, the server will wait for the clients
		// to connect before starting.
		// If no number is specified here, the server starts with 1 client, and others can join
		// in-game.
		// Since Boris has implemented join in-game, there is no actual need for specifying a
		// particular number here.
		// FIXME: for dedicated server, numnodes needs to be set to 0 upon start
/*		if (M_IsNextParm())
			doomcom->numnodes = (INT16)atoi(M_GetNextParm());
		else */if (dedicated)
			doomcom->numnodes = 0;
		else
			doomcom->numnodes = 1;

		if (doomcom->numnodes < 0)
			doomcom->numnodes = 0;
		if (doomcom->numnodes > MAXNETNODES)
			doomcom->numnodes = MAXNETNODES;

		// server
		servernode = 0;
		// FIXME:
		// ??? and now ?
		// server on a big modem ??? 4*isdn
		net_bandwidth = 16000;
		hardware_MAXPACKETLENGTH = INETPACKETLENGTH;

		ret = true;
	}
	else if (M_CheckParm("-connect"))
	{
		if (M_IsNextParm())
			strcpy(serverhostname, M_GetNextParm());
		else
			serverhostname[0] = 0; // assuming server in the LAN, use broadcast to detect it

		// server address only in ip
		if (serverhostname[0])
		{
			COM_BufAddText("connect \"");
			COM_BufAddText(serverhostname);
			COM_BufAddText("\"\n");

			// probably modem
			hardware_MAXPACKETLENGTH = INETPACKETLENGTH;
		}
		else
		{
			// so we're on a LAN
			COM_BufAddText("connect any\n");

			net_bandwidth = 800000;
			hardware_MAXPACKETLENGTH = MAXPACKETLENGTH;
		}
	}
    mypacket.maxlen = hardware_MAXPACKETLENGTH;
    I_NetOpenSocket = NET_OpenSocket;
    I_Ban = NET_Ban;
    I_ClearBans = NET_ClearBans;
    I_GetNodeAddress = NET_GetNodeAddress;
    I_GetBanAddress = NET_GetBanAddress;
    I_SetBanAddress = NET_SetBanAddress;
    bannednode = NET_bannednode;
    return ret;
#else
    if ( M_CheckParm ("-net") ) I_Error("-net not supported\n");
    return false;
#endif
}
#endif