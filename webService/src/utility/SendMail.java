package utility;
import java.util.Properties;

import javax.mail.Message;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

public class SendMail {
	String body;
	String subject;
	static final String sender = "milctdev.team@gmail.com";
	String receiver;
	static final String SMTP_USERNAME = "AKIAIXPHRE7ZQ3NZ2Y3Q";
	static final String SMTP_PASSWORD = "BEOJOBrjnGbb3Yfa6jX6oj0hqPigH3p164Cu3Z+TeYvi";
	static final String HOST = "email-smtp.us-east-1.amazonaws.com";
	static final int PORT = 587;
	
	public SendMail(String body, String subject, String receiver) {
		this.body = body;
		this.subject = subject;
		this.receiver = receiver;
	}
	
	public boolean send() {
		boolean result = false;
		// Create a Properties object to contain connection configuration information.
    	Properties props = System.getProperties();
    	props.put("mail.transport.protocol", "smtp");
    	props.put("mail.smtp.port", PORT); 
    	props.put("mail.smtp.starttls.enable", "true");
    	props.put("mail.smtp.auth", "true");

        // Create a Session object to represent a mail session with the specified properties. 
    	Session session = Session.getDefaultInstance(props);

        // Create a message with the specified information. 
        MimeMessage msg = new MimeMessage(session);
        Transport transport = null;
        try {
        	msg.setFrom(new InternetAddress(sender));
            msg.setRecipient(Message.RecipientType.TO, new InternetAddress(receiver));
            msg.setSubject(subject);
            msg.setContent(body,"text/html");
            
            // Create a transport.
            transport = session.getTransport();
            
            // Connect to Amazon SES using the SMTP username and password you specified above.
            transport.connect(HOST, SMTP_USERNAME, SMTP_PASSWORD);
        	
            // Send the email.
            transport.sendMessage(msg, msg.getAllRecipients());
            result = true;
            
        }catch(Exception e) {
        	e.printStackTrace();
        }finally {
        	
            // Close and terminate the connection.
        	try {
        		transport.close();
        	}catch(Exception e) {
        		e.printStackTrace();
        	}
            
        }
        return result;
	}
}
