package servlet;

import java.io.IOException;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import dbConnection.DatabaseConnection;
import utility.GetDb;
import utility.SendMail;

import java.util.Date;

/**
 * Servlet implementation class InvioOrdine
 */
@WebServlet("/InvioOrdine")
public class InvioOrdine extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public InvioOrdine() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String codiceAzienda = request.getParameter("codiceAzienda");
		String username = request.getParameter("username");
		String tot = request.getParameter("totale"); //viene passato perché già calcolato dal frontend
		String json = "";
		String nomeUtente = "", nomeAzienda = "", mailUtente = "", mailAzienda = "";
		String url = GetDb.getUrlAuthDb();
		DatabaseConnection dbConnect = new DatabaseConnection(url); // per prelevare le mail e i nomi dell'utente e dell'azienda
		try {
			dbConnect.connectToDB();
		}catch(SQLException e) {
			e.printStackTrace();
		}
		ResultSet s = dbConnect.doSelectQuery("select nome,mail from users where username='"+username+"'");
		try {
			while(s.next()) {
				nomeUtente = s.getString(1);
				mailUtente = s.getString(2);
			}
		}catch(SQLException e) {
			e.printStackTrace();
		}
		s = dbConnect.doSelectQuery("select nome,mail from aziende where codAzienda='"+codiceAzienda+"'");
		try {
			while(s.next()) {
				nomeAzienda = s.getString(1);
				mailAzienda = s.getString(2);
			}
		}catch(SQLException e) {
			e.printStackTrace();
		}
		dbConnect.closeConnection();
		dbConnect=new DatabaseConnection("mpm.cosomr3u722g.eu-west-3.rds.amazonaws.com:1433;databaseName="+codiceAzienda+";user=admin;password=123Carrarobmx?");
		try {
			dbConnect.connectToDB();
		}catch(SQLException e) {
			e.printStackTrace();
		}
		// ottenimento data odierna
		Date date = new Date();
		DateFormat format = new SimpleDateFormat("yyyy/MM/dd");
		String data = format.format(date);
		data = data.replaceAll("/", "-");
		
		String contenutoMailUtente = "";
		String contenutoMailAzienda = "";
		String soggettoUtente = "";
		String soggettoAzienda = "";
		
		//inizio procedure sul database
		ResultSet rs = null;
		ResultSet r = null;
		int aff = 0;
		int affected = dbConnect.doQuery("insert into ordini(data,username,totale) values ('"+data+"','"+username+"',"+Float.parseFloat(tot)+")");
		if (affected != 0) {
			rs = dbConnect.doSelectQuery("select codiceOrdine from ordini where data='"+data+"' and username='"+username+"' and totale="+Float.parseFloat(tot));
			int codice = 0;
			try {
				while(rs.next()) {
					codice = rs.getInt(1);
				}
				soggettoUtente += "SmartOrder: ordine #"+codice;
				soggettoAzienda += "Smartorder: ordine #"+codice;
				contenutoMailUtente += "Buongiorno "+nomeUtente+",<br/>Oggi <strong>"+data+"</strong>, hai effettuato il seguente ordine (id: <strong>#"+codice+"</strong>) presso l'azienda "+nomeAzienda+":<br/><br/>";
				contenutoMailAzienda += "Buongiorno "+nomeAzienda+",<br/> é appena arrivato il seguente ordine (id: <strong>#"+codice+"</strong>) da parte dell'utente "+username+":<br/><br/>";
				contenutoMailUtente += "<table style='border-collapse: collapse;'><tr><th style='border: 1px solid black;'>Nome</th><th style='border: 1px solid black;'>Codice</th><th style='border: 1px solid black;'>Quantità</th><th style='border: 1px solid black;'>Prezzo singolo</th><th style='border: 1px solid black;'>Parziale</th></tr>";
				contenutoMailAzienda += "<table style='border-collapse: collapse;'><tr><th style='border: 1px solid black;'>Nome</th><th style='border: 1px solid black;'>Codice</th><th style='border: 1px solid black;'>Quantità</th><th style='border: 1px solid black;'>Prezzo singolo</th><th style='border: 1px solid black;'>Parziale</th></tr>";
				rs = dbConnect.doSelectQuery("select barCode,quantita from contenutoCarrelli where username='"+username+"'");
				while(rs.next()) {
					r = dbConnect.doSelectQuery("select nome,prezzo from articoli where barCode='"+rs.getString(1)+"'");
					while(r.next()) {
						contenutoMailUtente += "<tr><td style='border: 1px solid black; text-align: center;'>"+r.getString(1)+"</td><td style='border: 1px solid black; text-align: center;'>"+rs.getString(1)+"</td><td style='border: 1px solid black; text-align: center;'>"+rs.getInt(2)+"</td><td style='border: 1px solid black; text-align: center;'>"+r.getFloat(2)+"</td><td style='border: 1px solid black; text-align: center;'>"+(r.getFloat(2)*rs.getInt(2))+"</td></tr>";
						contenutoMailAzienda += "<tr><td style='border: 1px solid black; text-align: center;'>"+r.getString(1)+"</td><td style='border: 1px solid black; text-align: center;'>"+rs.getString(1)+"</td><td style='border: 1px solid black; text-align: center;'>"+rs.getInt(2)+"</td><td style='border: 1px solid black; text-align: center;'>"+r.getFloat(2)+"</td><td style='border: 1px solid black; text-align: center;'>"+(r.getFloat(2)*rs.getInt(2))+"</td></tr>";
					}
					aff = dbConnect.doQuery("insert into contenutoOrdini(codiceOrdine,barCode,quantita) values('"+codice+"','"+rs.getString(1)+"',"+rs.getInt(2)+")");
					if (aff == 0) {
						json += "{\"ok\":\"0\"}";
						break;
					}
				}
				aff = dbConnect.doQuery("delete from contenutoCarrelli where username='"+username+"'");
				if (aff == 0) {
					json += "{\"ok\":\"0\"}";
				}
			}catch(SQLException e) {
				e.printStackTrace();
			}
		}else {
			json += "{\"ok\":\"0\"}";
		}
		
		contenutoMailUtente += "</table><br/>Per un totale di <strong>"+tot+"</strong> EUR.<br/> Si tratta di una mail informativa, si prega di non rispondere.<br/> Grazie,<br/><strong>SmartOrder</strong>";
		contenutoMailAzienda += "</table><br/>Si prega di inviare l'ordine al più presto.<br/> Si tratta di una mail informativa, si prega di non rispondere.<br/> Grazie,<br/><strong>SmartOrder</strong>";
		dbConnect.closeConnection();
		try {
			rs.close();
			r.close();
			s.close();
		}catch(SQLException e) {
			e.printStackTrace();
		}
		
		// fine procedure sul database
		
		//inizio prcedure per invio mails: testo e oggetto mail già formattati
		SendMail mail1 = new SendMail(contenutoMailUtente,soggettoUtente,mailUtente);
		SendMail mail2 = new SendMail(contenutoMailAzienda,soggettoAzienda,mailAzienda);
		
		boolean m1 = mail1.send();
		boolean m2 = mail2.send();
		
		if(m1 && m2) {
			json += "{\"ok\":\"1\"}";
		}
		
		// fine procedure per invio mails
		response.setContentType("application/json");
		response.getWriter().write(json);
	}

}
