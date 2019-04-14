package servlet;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import utility.GetDb;
import java.sql.*;
import dbConnection.DatabaseConnection;

/**
 * Servlet implementation class autenticazione
 */
@WebServlet("/Autenticazione")
public class Autenticazione extends HttpServlet {
	private static final long serialVersionUID = 1L;

    /**
     * Default constructor. 
     */
    public Autenticazione() {
    	super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String url = GetDb.getUrlAuthDb();
		
		//prelievo parametri richiesta
		String username = request.getParameter("username");
		String password = request.getParameter("password");

		//connessione al database
		DatabaseConnection dbConnect=new DatabaseConnection(url);
		try {
			dbConnect.connectToDB();
		}catch(SQLException e) {
			e.printStackTrace();
		}

		//esecuzione query
		ResultSet rs = dbConnect.doSelectQuery("select * from users");

		//generazione stringa JSON di risposta
		String json = "";
		json = generateResponse(rs,username,password);

		//invio risposta
		response.setContentType("application/json");
		response.getWriter().write(json);

		//chiusura connessione con database
		dbConnect.closeConnection();
		try {
			rs.close();
		}catch(SQLException e) {
			e.printStackTrace();
		}
	}
	
	public String generateResponse(ResultSet rs, String user, String psw) {
		String json = "";
		boolean trovato = false;
		
		try {
			while(rs.next() && trovato == false) {
				if(rs.getString(1).equals(user)) {
					if(rs.getString(2).equals(psw)) {
						json="{\"codice\":\"0\",\"codiceAzienda\":\""+rs.getString(4)+"\",\"username\":\""+
								rs.getString(1)+"\"}";
						trovato = true;
					}else {
						json="{\"codice\":\"1\"}"; // codice 1 è password errata
					}
				}else {
					json="{\"codice\":\"2\"}"; // codice 2 è username non trovata
				}
			}
		}catch(SQLException e) {
			e.printStackTrace();
		}
		return json;
	}

}
