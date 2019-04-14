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

/**
 * Servlet implementation class PrelevaOrdini
 */
@WebServlet("/PrelevaOrdini")
public class PrelevaOrdini extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public PrelevaOrdini() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String username = request.getParameter("username");
		String codiceAzienda = request.getParameter("codiceAzienda");
		DatabaseConnection dbConnect=new DatabaseConnection("mpm.cosomr3u722g.eu-west-3.rds.amazonaws.com:1433;databaseName="+codiceAzienda+";user=admin;password=123Carrarobmx?");
		
		try {
			dbConnect.connectToDB();
		}catch(SQLException e) {
			e.printStackTrace();
		}
		String json = "{\"ok\":\"1\",\"ordini\":[";
		boolean entrato = false;
		ResultSet rs = dbConnect.doSelectQuery("select codiceOrdine,data,totale from ordini where username='"+username+"'");
		try {
			while(rs.next()) {
				entrato = true;
				json += "{\"codice\":\""+rs.getInt(1)+"\",\"data\":\""+rs.getDate(2)+"\",\"totale\":\""+rs.getFloat(3)+"\"},";
			}
			if(!entrato) {
				json = "{\"ok\":\"0\"}";
			}else {
				json = json.substring(0, json.length() - 1);
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
