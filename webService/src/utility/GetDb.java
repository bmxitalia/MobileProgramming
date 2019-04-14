package utility;

public class GetDb {
	private static String urlAuthDB = "mpm.cosomr3u722g.eu-west-3.rds.amazonaws.com:1433;databaseName=autenticazione;user=admin;password=123Carrarobmx?";
	
	/*
	 * Metodo che restituisce l'URL del CommonDb su server cloud.
	 */
	public static String getUrlAuthDb() {
		return urlAuthDB;
	}
}