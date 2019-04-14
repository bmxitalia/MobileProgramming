package servlet;

import java.io.IOException;
import java.sql.ResultSet;
import java.sql.SQLException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import dbConnection.DatabaseConnection;
import utility.GetDb;

/**
 * Servlet implementation class prelievoInfoArticoli
 */
@WebServlet("/PrelievoInfoArticoli")
public class PrelievoInfoArticoli extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public PrelievoInfoArticoli() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String username = request.getParameter("username");
		String codiceAzienda = request.getParameter("codiceAzienda");
		
		// istruzioni per prelevare il nome dell'utente
		String url = GetDb.getUrlAuthDb();
		
		DatabaseConnection dbConnect=new DatabaseConnection(url);
		try {
			dbConnect.connectToDB();
		}catch(SQLException e) {
			e.printStackTrace();
		}

		ResultSet rs = dbConnect.doSelectQuery("select nome from users where username='"+username+"'");
		String nome = "";
		try {
			while(rs.next()) {
				nome = rs.getString(1);
			}
		}catch(SQLException e) {
			e.printStackTrace();
		}

		dbConnect.closeConnection();
		try {
			rs.close();
		}catch(SQLException e) {
			e.printStackTrace();
		}
		
		// fine istruzione prelievo nome 
		
		// inizio istruzioni prelievo articoli in carrello
		dbConnect=new DatabaseConnection("mpm.cosomr3u722g.eu-west-3.rds.amazonaws.com:1433;databaseName="+codiceAzienda+";user=admin;password=123Carrarobmx?");
		try {
			dbConnect.connectToDB();
		}catch(SQLException e) {
			e.printStackTrace();
		}
		
		String json = "{\"nome\":\""+nome+"\",\"articoli\":[";
		rs = dbConnect.doSelectQuery("select barCode, quantita from contenutoCarrelli where username='"+username+"'");
		ResultSet n;
		try {
			int qta = 0;
			String cod = "";
			String name = "";
			float price = 0;
			boolean entrato = false;
			while(rs.next()) {
				cod = rs.getString(1);
				qta = rs.getInt(2);
				n = dbConnect.doSelectQuery("select nome,prezzo from articoli where barCode='"+cod+"'");
				while(n.next()) {
					name = n.getString(1);
					price = n.getFloat(2);
				}
				entrato = true; //significa che l'utente ha degli articoli in carrello
				json += "{\"codice\":\""+cod+"\",\"nome\":\""+name+"\",\"quantita\":\""+qta+"\",\"prezzo\":\""+price+"\"},"; // se l'utente ha articoli restituisco la lista con le info degli articoli
			}
			if(!entrato) {
				json += "]}"; //se l'utente non ha articoli restituisco l'array vuoto
			}else {
				json = json.substring(0, json.length() - 1); //per togliere l'ultima virgola
				json += "]}";
			}
		}catch(SQLException e) {
			e.printStackTrace();
		}
		

		//chiusura connessione con database
		dbConnect.closeConnection();
		try {
			rs.close();
		}catch(SQLException e) {
			e.printStackTrace();
		}
		
		//invio risposta
		response.setContentType("application/json");
		response.getWriter().write(json);
	}

}
