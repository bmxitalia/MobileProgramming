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
 * Servlet implementation class EliminazioneArticoli
 */
@WebServlet("/EliminazioneArticoli")
public class EliminazioneArticoli extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public EliminazioneArticoli() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String username = request.getParameter("username");
		String codiceAzienda = request.getParameter("codiceAzienda");
		String barcodeList = request.getParameter("codici");
		
		DatabaseConnection dbConnect=new DatabaseConnection("mpm.cosomr3u722g.eu-west-3.rds.amazonaws.com:1433;databaseName="+codiceAzienda+";user=admin;password=123Carrarobmx?");
		try {
			dbConnect.connectToDB();
		}catch(SQLException e) {
			e.printStackTrace();
		}
		// preparazione query per rimozione codici
		String query = "";
		if(barcodeList.equals("all")) {
			query = "delete from contenutoCarrelli where username='"+username+"'";
		}else {
			String[] list = barcodeList.split(",");
			query = "delete from contenutoCarrelli where username='"+username+"' and (";
			for(int i=0;i<list.length;i++) {
				query += "barCode='"+list[i]+"' or ";
			}
			query = query.substring(0, query.length() - 4);
			query += ")";
		}
		
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
