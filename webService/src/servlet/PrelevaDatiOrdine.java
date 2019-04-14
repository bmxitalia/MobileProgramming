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
 * Servlet implementation class PrelevaDatiOrdine
 */
@WebServlet("/PrelevaDatiOrdine")
public class PrelevaDatiOrdine extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public PrelevaDatiOrdine() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String codiceAzienda = request.getParameter("codiceAzienda");
		String codiceOrdine = request.getParameter("codiceOrdine");
		DatabaseConnection dbConnect=new DatabaseConnection("mpm.cosomr3u722g.eu-west-3.rds.amazonaws.com:1433;databaseName="+codiceAzienda+";user=admin;password=123Carrarobmx?");
		
		try {
			dbConnect.connectToDB();
		}catch(SQLException e) {
			e.printStackTrace();
		}
		String json = "{\"ok\":\"1\",\"articoli\":[";
		boolean entrato = false;
		ResultSet r = null;
		ResultSet rs = dbConnect.doSelectQuery("select barCode,quantita from contenutoOrdini where codiceOrdine='"+codiceOrdine+"'");
		try {
			while(rs.next()) {
				entrato = true;
				r = dbConnect.doSelectQuery("select nome,prezzo from articoli where barCode='"+rs.getString(1)+"'");
				while(r.next()) {
					json += "{\"barCode\":\""+rs.getString(1)+"\",\"nome\":\""+r.getString(1)+"\",\"quantita\":\""+rs.getInt(2)+"\",\"prezzo\":\""+r.getFloat(2)+"\",\"parziale\":\""+(r.getFloat(2)*rs.getInt(2))+"\"},";
				}
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
			r.close();
		}catch(SQLException e) {
			e.printStackTrace();
		}
		
		//invio risposta
		response.setContentType("application/json");
		response.getWriter().write(json);
	}

}
