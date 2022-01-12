package com.websocket.demo;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import org.json.JSONObject;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

@Component
public class SocketHandler extends TextWebSocketHandler {
	
	public static Map<String, Set<WebSocketSession>> sessionsMap = new HashMap<>();
	public static final String FACTS_URL = "/facts";
	public static final String USERS_URL = "/users";
	
	public SocketHandler() {
		sessionsMap.put(FACTS_URL, new HashSet<>());
		sessionsMap.put(USERS_URL, new HashSet<>());
	}
	
	@Override
	public void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
		String payload = message.getPayload();
		JSONObject jsonPayload = new JSONObject(payload);
		
		if(jsonPayload.has("subscribe")) {
			String url = jsonPayload.getString("subscribe");
			if(sessionsMap.containsKey(url)) {
				sessionsMap.get(url).add(session);
			}
		} else if(jsonPayload.has("unsubscribe")) {
			// TODO
		}
	}

}