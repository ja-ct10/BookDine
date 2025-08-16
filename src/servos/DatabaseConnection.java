package servos;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DatabaseConnection {
    
    private static Connection con = null;
        
    public static Connection getConnection(){
        if (con == null) {
           try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            
            con = DriverManager.getConnection("jdbc:mysql://127.0.0.1:3308/servos","root","");
            
            } catch(ClassNotFoundException | SQLException e) {
            System.out.println(e.getMessage());
            }
        }
        return con; 
    }
}