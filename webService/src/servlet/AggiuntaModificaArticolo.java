package servlet;

import java.io.IOException;
import java.sql.SQLException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import dbConnection.DatabaseConnection;

/**
 * Servlet implementation class AggiuntaModificaArticolo
 */
@WebServlet("/AggiuntaModificaArticolo")
public class AggiuntaModificaArticolo extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public AggiuntaModificaArticolo() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String codiceAzienda = request.getParameter("codiceAzienda");
		String query = request.getParameter("query");
		
		DatabaseConnection dbConnect=new DatabaseConnection("mpm.cosomr3u722g.eu-west-3.rds.amazonaws.com:1433;databaseName="+codiceAzienda+";user=admin;password=123Carrarobmx?");
		try {
			dbConnect.connectToDB();
		}catch(SQLException e) {
			e.printStackTrace();
		}
		// preparazione query per rimozione codici
		
		int affected = dbConnect.doQuery(query);
		String json = "";
		if(affected != 0) {
			json += "{\"ok\":\"1\"}";
		}else {
			json += "{\"ok\":\"0\"}";
		}

		dbConnect.closeConnection();
		response.setContentType("application/json");
		response.getWriter().write(json);
	}

}
