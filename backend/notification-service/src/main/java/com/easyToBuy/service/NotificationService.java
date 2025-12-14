package main.java.com.programmingtechie.notificationservice.service;

import com.programmingtechie.notificationservice.event.OrderPlacedEvent;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class NotificationService {

    @KafkaListener(topics = "order-topic", groupId = "notification-group")
    public void handleNotification(OrderPlacedEvent orderPlacedEvent) {
        log.info("Received Notification for Order - {}", orderPlacedEvent.getOrderNumber());
        log.info("Sending email to: {}", orderPlacedEvent.getEmail());
        // Logic to send email
    }
}
