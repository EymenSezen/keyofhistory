package com.keyofhistory.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    public void sendVerificationEmail(String email, String username, String token) {
        if (mailSender == null) {
            System.out.println("JavaMailSender is not configured. Verification email simulation for user: " 
                    + username + " -> Link: http://localhost:3000/verify?token=" + token);
            return;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("no-reply@keyofhistory.com");
            message.setTo(email);
            message.setSubject("Key of History - E-posta Doğrulama");

            String verificationUrl = "http://localhost:3000/verify?token=" + token;

            String body = String.format(
                    "Merhaba %s,\n\n" +
                    "Key of History platformuna kayıt olduğunuz için teşekkür ederiz.\n" +
                    "Hesabınızı aktifleştirmek ve giriş yapabilmek için lütfen aşağıdaki bağlantıya tıklayın:\n\n" +
                    "%s\n\n" +
                    "Saygılarımızla,\n" +
                    "Key of History Ekibi",
                    username, verificationUrl
            );

            message.setText(body);
            mailSender.send(message);
            System.out.println("Verification email successfully sent to " + email);
        } catch (Exception e) {
            System.err.println("Failed to send verification email to " + email + ": " + e.getMessage());
        }
    }
}
