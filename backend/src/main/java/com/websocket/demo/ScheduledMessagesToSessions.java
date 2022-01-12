package com.websocket.demo;

import java.io.IOException;
import java.util.Iterator;
import java.util.Set;

import org.json.JSONObject;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import com.github.javafaker.Artist;
import com.github.javafaker.ChuckNorris;
import com.github.javafaker.Faker;

@Component
public class ScheduledMessagesToSessions {
	
    @Scheduled(fixedDelay=5000)
    public void publishChuckNorrisFacts() throws IOException{
    	Faker faker = new Faker();
    	 
    	ChuckNorris chuckNorris = faker.chuckNorris();
    	
    	Set<WebSocketSession> factsSessions = SocketHandler.sessionsMap.get(SocketHandler.FACTS_URL);
    	if(factsSessions == null) {
    		return;
    	}
    	
    	Iterator<WebSocketSession> sessionsIterator = factsSessions.iterator();
        while(sessionsIterator.hasNext()){
        	WebSocketSession webSocketSession =
        			sessionsIterator.next();
        	if(webSocketSession.isOpen()) {
        		JSONObject jsonOutputMessage = getJsonOutputMessage(SocketHandler.FACTS_URL, chuckNorris.fact());
    			webSocketSession.sendMessage(new TextMessage(jsonOutputMessage.toString()));
    		} else {
    			sessionsIterator.remove();
    		}
        }

    }

    
    @Scheduled(fixedDelay=5000)
    public void publishNewUserNames() throws IOException{
    	Faker faker = new Faker();
    	 
    	Artist artist = faker.artist();
    	
    	Set<WebSocketSession> factsSessions = SocketHandler.sessionsMap.get(SocketHandler.USERS_URL);
    	if(factsSessions == null) {
    		return;
    	}
    	
    	Iterator<WebSocketSession> sessionsIterator = factsSessions.iterator();
        while(sessionsIterator.hasNext()){
        	WebSocketSession webSocketSession =
        			sessionsIterator.next();
        	if(webSocketSession.isOpen()) {    			
    			JSONObject jsonOutputMessage = getJsonOutputMessage(SocketHandler.USERS_URL, artist.name());
    			webSocketSession.sendMessage(new TextMessage(jsonOutputMessage.toString()));
    		} else {
    			sessionsIterator.remove();
    		}
        }

    }
    
	private JSONObject getJsonOutputMessage(String url, String message) {
		JSONObject jsonObject = new JSONObject();
		jsonObject.put("url", url);
		jsonObject.put("message", message);
		return jsonObject;
	}
}
