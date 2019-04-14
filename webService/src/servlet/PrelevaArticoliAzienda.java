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
 * Servlet implementation class PrelevaArticoliAzienda
 */
@WebServlet("/PrelevaArticoliAzienda")
public class PrelevaArticoliAzienda extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public PrelevaArticoliAzienda() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String codiceAzienda = request.getParameter("codiceAzienda");
		DatabaseConnection dbConnect=new DatabaseConnection("mpm.cosomr3u722g.eu-west-3.rds.amazonaws.com:1433;databaseName="+codiceAzienda+";user=admin;password=123Carrarobmx?");
		
		try {
			dbConnect.connectToDB();
		}catch(SQLException e) {
			e.printStackTrace();
		}
		String json = "{\"ok\":\"1\",\"articoli\":[";
		boolean entrato = false;
		ResultSet rs = dbConnect.doSelectQuery("select nome,barCode,prezzo from articoli");
		try {
			while(rs.next()) {
				entrato = true;
				json += "{\"nome\":\""+rs.getString(1)+"\",\"barCode\":\""+rs.getString(2)+"\",\"prezzo\":\""+rs.getFloat(3)+"\"},";
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
