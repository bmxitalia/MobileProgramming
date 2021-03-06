package dbConnection;

import java.sql.*;

public class DatabaseConnection {
	private String url;
	private String username;
	private String password;
	private String dbName;
	private Connection connection;
	
	/*
	 * Costruttore che richiede i 4 parametri per la connessione ad un database:
	 * u: � l'url del database (es. vision.cloudapp.net:1500)
	 * user: nome utente per l'accesso al database
	 * psw: password per l'accesso al database
	 * db: nome del database al quale collegarsi
	 */
	public DatabaseConnection(String u, String user, String psw, String db) {
		url=u;
		username=user;
		password=psw;
		dbName=db;
	}
	
	/*
	 * Costruttore che accetta come parametro un'intera stringa di connessione al posto dei 4 parametri divisi.
	 * Utilizzato nei casi in cui ci si connette ad un db con una stringa di connessione presa a sua volta da un db (es. Aziende.Path)
	 */
	public DatabaseConnection(String dbConnectionString) {

		//split su ";"
		String[] splitted=dbConnectionString.split(";");

		//split su "=" coppia database
		String[] db=splitted[1].split("=");

		//split su "=" coppia username
		String[] user2=splitted[2].split("=");

		//split su "=" coppia password
		String[] psw2=splitted[3].split("=");

		//prelievo url
		url=splitted[0];

		//prelievo nome db
		dbName=db[1];

		//prelievo username
		username=user2[1];

		//prelievo password
		password=psw2[1];
	}
	
	/*
	 * Metodo per la connessione al database. 
	 * Costruisce la url con gli attibuti dell'oggetto d'invocazione e costruisce una connessione tramite driver jdbc per SQL Server
	 */
	public void connectToDB() throws SQLException{
		try {
			//configurazione driver JDBC
			Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");

			//costruzione url di connessione al database
			String connectionUrl="jdbc:sqlserver://"+url+";databaseName="+
					dbName+";user="+username+";password="+password;

			//connessione al database
			connection=DriverManager.getConnection(connectionUrl);
		}catch(ClassNotFoundException e) {
			e.printStackTrace();
		}
	}
	
	/*
	 * Metodo che permette di eseguire una query sul database.
	 * Attenzione: invocare tale metodo solamente se la connessione al database � gi� impostata.
	 * Accetta in input una query in formato stringa e restituisce un ResultSet.
	 * Attenzione: nel caso di query insert e delete il ResultSet sar� vuoto e verr� lanciata un'eccezione a run time che non serve gestire.
	 * Infatti in caso di query di insert, update o delete bisogna utilizzare il metodo sottostante.
	 */
	public ResultSet doSelectQuery(String query) {
		ResultSet rs = null;
		try {
			Statement st = connection.createStatement();
			rs=st.executeQuery(query);
		}catch(SQLException e) {
			e.printStackTrace();
		}
		return rs;
	}
	
	
	/*
	 * Metodo che permette di eseguire una query senza ritorno sul database.
	 * In particolare � da utilizzare per le query di INSERT, UPDATE e DELETE.
	 * Attenzione: invocare tale metodo solamente se la connessione al database � gi� impostata.
	 * Accetta in input una query in formato stringa e restituisce un intero contenente il numero di righe coinvolte nell'inserimento, modifica o cancellazione.
	 */
	public int doQuery(String query) {
		int affectedRows = 0;
		try {
			Statement st=connection.createStatement();
			affectedRows=st.executeUpdate(query);
		}catch(SQLException e) {
			e.printStackTrace();
		}
		return affectedRows;
	}
	
	/*
	 * Mettodo per chiudere la connessione con il database.
	 */
	public void closeConnection() {
		try {
			connection.close();
		}catch(SQLException e) {
			e.printStackTrace();
		}
		
	}
}