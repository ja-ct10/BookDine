package servos;

import java.sql.Connection;
import java.awt.Toolkit;
import java.sql.PreparedStatement;
import javax.swing.JOptionPane;
import java.sql.ResultSet;
import java.sql.SQLException;

public class RegistrationFrame extends javax.swing.JFrame {
    
    Connection con = DatabaseConnection.getConnection();
    ResultSet rs = null;
    PreparedStatement pst = null;
    
    public RegistrationFrame() {
        initComponents();
        setTitle("Servos");
        this.hide.setVisible(false);
        this.hide1.setVisible(false);
        setIconImage();
        if (con == null) {
        JOptionPane.showMessageDialog(this, "Failed to connect to the database.", "Database Error", JOptionPane.ERROR_MESSAGE);
        }
    }
    private void setIconImage() {
        setIconImage(Toolkit.getDefaultToolkit().getImage(getClass().getResource("/ICON/logo1.png")));
    }
    private void clearPasswordFields() {
        pfpassword.setText("");
        cpassword.setText("");
    }

    private void clearFields() {
        firstName.setText("");
        lastName.setText("");
        tfusername.setText("");
        clearPasswordFields();
    }
    @SuppressWarnings("unchecked")
    // <editor-fold defaultstate="collapsed" desc="Generated Code">//GEN-BEGIN:initComponents
    private void initComponents() {

        jPanel2 = new javax.swing.JPanel();
        jPanel3 = new javax.swing.JPanel();
        LogoName = new javax.swing.JLabel();
        jLabel1 = new javax.swing.JLabel();
        jLabel7 = new javax.swing.JLabel();
        jLabel2 = new javax.swing.JLabel();
        jPanel1 = new javax.swing.JPanel();
        jLabel3 = new javax.swing.JLabel();
        jLabel8 = new javax.swing.JLabel();
        jLabel4 = new javax.swing.JLabel();
        jSeparator5 = new javax.swing.JSeparator();
        lastName = new javax.swing.JTextField();
        firstName = new javax.swing.JTextField();
        jSeparator2 = new javax.swing.JSeparator();
        jLabel9 = new javax.swing.JLabel();
        tfusername = new javax.swing.JTextField();
        jSeparator3 = new javax.swing.JSeparator();
        jLabel10 = new javax.swing.JLabel();
        jSeparator4 = new javax.swing.JSeparator();
        pfpassword = new javax.swing.JPasswordField();
        jLabel11 = new javax.swing.JLabel();
        cpassword = new javax.swing.JPasswordField();
        jSeparator6 = new javax.swing.JSeparator();
        btnRegister = new javax.swing.JButton();
        LoginLabel = new javax.swing.JLabel();
        jLabel12 = new javax.swing.JLabel();
        show = new javax.swing.JLabel();
        hide = new javax.swing.JLabel();
        hide1 = new javax.swing.JLabel();
        show1 = new javax.swing.JLabel();

        setDefaultCloseOperation(javax.swing.WindowConstants.EXIT_ON_CLOSE);
        getContentPane().setLayout(new org.netbeans.lib.awtextra.AbsoluteLayout());

        jPanel2.setLayout(null);

        jPanel3.setBackground(new java.awt.Color(0, 0, 0, 180));

        LogoName.setFont(new java.awt.Font("Book Antiqua", 1, 40)); // NOI18N
        LogoName.setForeground(new java.awt.Color(255, 255, 255));
        LogoName.setText("S E R V O S");

        jLabel1.setIcon(new javax.swing.ImageIcon(getClass().getResource("/ICON/LOGO.png"))); // NOI18N
        jLabel1.setToolTipText("");

        jLabel7.setFont(new java.awt.Font("Book Antiqua", 3, 18)); // NOI18N
        jLabel7.setForeground(new java.awt.Color(255, 255, 255));
        jLabel7.setText("\"Taste the passion in every plate\"");

        javax.swing.GroupLayout jPanel3Layout = new javax.swing.GroupLayout(jPanel3);
        jPanel3.setLayout(jPanel3Layout);
        jPanel3Layout.setHorizontalGroup(
            jPanel3Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, jPanel3Layout.createSequentialGroup()
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                .addComponent(jLabel7)
                .addGap(57, 57, 57))
            .addGroup(jPanel3Layout.createSequentialGroup()
                .addGroup(jPanel3Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(jPanel3Layout.createSequentialGroup()
                        .addGap(86, 86, 86)
                        .addComponent(LogoName))
                    .addGroup(jPanel3Layout.createSequentialGroup()
                        .addGap(71, 71, 71)
                        .addComponent(jLabel1)))
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
        );
        jPanel3Layout.setVerticalGroup(
            jPanel3Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel3Layout.createSequentialGroup()
                .addGap(93, 93, 93)
                .addComponent(jLabel1, javax.swing.GroupLayout.PREFERRED_SIZE, 238, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(LogoName, javax.swing.GroupLayout.PREFERRED_SIZE, 40, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(jLabel7)
                .addContainerGap(94, Short.MAX_VALUE))
        );

        jPanel2.add(jPanel3);
        jPanel3.setBounds(0, 0, 400, 500);

        jLabel2.setIcon(new javax.swing.ImageIcon(getClass().getResource("/ICON/744332799228ad7460c91e0598bf597c.jpg"))); // NOI18N
        jPanel2.add(jLabel2);
        jLabel2.setBounds(0, -20, 400, 520);

        getContentPane().add(jPanel2, new org.netbeans.lib.awtextra.AbsoluteConstraints(0, 0, 400, 500));

        jPanel1.setBackground(new java.awt.Color(255, 255, 255));

        jLabel3.setFont(new java.awt.Font("Ebrima", 1, 36)); // NOI18N
        jLabel3.setText(" Register");

        jLabel8.setFont(new java.awt.Font("Tahoma", 0, 14)); // NOI18N
        jLabel8.setText("FIRST NAME");

        jLabel4.setFont(new java.awt.Font("Tahoma", 0, 14)); // NOI18N
        jLabel4.setText("LAST NAME");

        jSeparator5.setForeground(new java.awt.Color(0, 0, 0));

        lastName.setFont(new java.awt.Font("Franklin Gothic Book", 0, 14)); // NOI18N
        lastName.setBorder(null);

        firstName.setFont(new java.awt.Font("Franklin Gothic Book", 0, 14)); // NOI18N
        firstName.setBorder(null);

        jSeparator2.setForeground(new java.awt.Color(0, 0, 0));

        jLabel9.setFont(new java.awt.Font("Tahoma", 0, 14)); // NOI18N
        jLabel9.setText("USERNAME");

        tfusername.setFont(new java.awt.Font("Franklin Gothic Book", 0, 14)); // NOI18N
        tfusername.setBorder(null);

        jSeparator3.setForeground(new java.awt.Color(0, 0, 0));

        jLabel10.setFont(new java.awt.Font("Tahoma", 0, 14)); // NOI18N
        jLabel10.setText("PASSWORD");

        jSeparator4.setForeground(new java.awt.Color(0, 0, 0));

        pfpassword.setFont(new java.awt.Font("Franklin Gothic Book", 0, 14)); // NOI18N
        pfpassword.setBorder(null);
        pfpassword.setOpaque(true);

        jLabel11.setFont(new java.awt.Font("Tahoma", 0, 14)); // NOI18N
        jLabel11.setText("CONFIRM PASSWORD");

        cpassword.setFont(new java.awt.Font("Franklin Gothic Book", 0, 14)); // NOI18N
        cpassword.setBorder(null);
        cpassword.setOpaque(true);

        jSeparator6.setForeground(new java.awt.Color(0, 0, 0));

        btnRegister.setBackground(new java.awt.Color(250, 207, 16));
        btnRegister.setFont(new java.awt.Font("Tahoma", 1, 12)); // NOI18N
        btnRegister.setForeground(new java.awt.Color(255, 255, 255));
        btnRegister.setText("Create an Account");
        btnRegister.setFocusable(false);
        btnRegister.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                btnRegisterActionPerformed(evt);
            }
        });

        LoginLabel.setFont(new java.awt.Font("Franklin Gothic Book", 1, 13)); // NOI18N
        LoginLabel.setForeground(new java.awt.Color(250, 207, 16));
        LoginLabel.setText("Login");
        LoginLabel.addMouseListener(new java.awt.event.MouseAdapter() {
            public void mouseClicked(java.awt.event.MouseEvent evt) {
                LoginLabelMouseClicked(evt);
            }
        });

        jLabel12.setFont(new java.awt.Font("Franklin Gothic Book", 0, 13)); // NOI18N
        jLabel12.setText("I have an account.");

        show.setIcon(new javax.swing.ImageIcon(getClass().getResource("/ICON/eye.png"))); // NOI18N
        show.addMouseListener(new java.awt.event.MouseAdapter() {
            public void mousePressed(java.awt.event.MouseEvent evt) {
                showMousePressed(evt);
            }
        });

        hide.setIcon(new javax.swing.ImageIcon(getClass().getResource("/ICON/invisible.png"))); // NOI18N
        hide.addMouseListener(new java.awt.event.MouseAdapter() {
            public void mousePressed(java.awt.event.MouseEvent evt) {
                hideMousePressed(evt);
            }
        });

        hide1.setIcon(new javax.swing.ImageIcon(getClass().getResource("/ICON/invisible.png"))); // NOI18N
        hide1.addMouseListener(new java.awt.event.MouseAdapter() {
            public void mousePressed(java.awt.event.MouseEvent evt) {
                hide1MousePressed(evt);
            }
        });

        show1.setIcon(new javax.swing.ImageIcon(getClass().getResource("/ICON/eye.png"))); // NOI18N
        show1.addMouseListener(new java.awt.event.MouseAdapter() {
            public void mousePressed(java.awt.event.MouseEvent evt) {
                show1MousePressed(evt);
            }
        });

        javax.swing.GroupLayout jPanel1Layout = new javax.swing.GroupLayout(jPanel1);
        jPanel1.setLayout(jPanel1Layout);
        jPanel1Layout.setHorizontalGroup(
            jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel1Layout.createSequentialGroup()
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(jPanel1Layout.createSequentialGroup()
                        .addGap(37, 37, 37)
                        .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addGroup(jPanel1Layout.createSequentialGroup()
                                .addComponent(cpassword, javax.swing.GroupLayout.PREFERRED_SIZE, 240, javax.swing.GroupLayout.PREFERRED_SIZE)
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                                .addComponent(hide1)
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                .addComponent(show1))
                            .addComponent(jLabel11)
                            .addGroup(jPanel1Layout.createSequentialGroup()
                                .addComponent(pfpassword, javax.swing.GroupLayout.PREFERRED_SIZE, 240, javax.swing.GroupLayout.PREFERRED_SIZE)
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                                .addComponent(hide)
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                .addComponent(show))
                            .addComponent(jLabel10)
                            .addComponent(jSeparator4, javax.swing.GroupLayout.PREFERRED_SIZE, 240, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING, false)
                                .addComponent(jLabel9)
                                .addComponent(tfusername)
                                .addComponent(jSeparator3, javax.swing.GroupLayout.PREFERRED_SIZE, 240, javax.swing.GroupLayout.PREFERRED_SIZE))
                            .addGroup(jPanel1Layout.createSequentialGroup()
                                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING, false)
                                    .addComponent(jLabel8)
                                    .addComponent(firstName)
                                    .addComponent(jSeparator2, javax.swing.GroupLayout.PREFERRED_SIZE, 150, javax.swing.GroupLayout.PREFERRED_SIZE))
                                .addGap(18, 18, 18)
                                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING, false)
                                    .addComponent(lastName)
                                    .addComponent(jSeparator5, javax.swing.GroupLayout.PREFERRED_SIZE, 150, javax.swing.GroupLayout.PREFERRED_SIZE)
                                    .addComponent(jLabel4, javax.swing.GroupLayout.PREFERRED_SIZE, 91, javax.swing.GroupLayout.PREFERRED_SIZE)))
                            .addComponent(jSeparator6, javax.swing.GroupLayout.PREFERRED_SIZE, 240, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addGroup(jPanel1Layout.createSequentialGroup()
                                .addComponent(jLabel12)
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                .addComponent(LoginLabel, javax.swing.GroupLayout.PREFERRED_SIZE, 37, javax.swing.GroupLayout.PREFERRED_SIZE))))
                    .addGroup(jPanel1Layout.createSequentialGroup()
                        .addGap(107, 107, 107)
                        .addComponent(jLabel3))
                    .addGroup(jPanel1Layout.createSequentialGroup()
                        .addGap(116, 116, 116)
                        .addComponent(btnRegister)))
                .addContainerGap(45, Short.MAX_VALUE))
        );
        jPanel1Layout.setVerticalGroup(
            jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel1Layout.createSequentialGroup()
                .addGap(22, 22, 22)
                .addComponent(jLabel3)
                .addGap(33, 33, 33)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(jLabel8)
                    .addComponent(jLabel4, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(jPanel1Layout.createSequentialGroup()
                        .addComponent(firstName, javax.swing.GroupLayout.PREFERRED_SIZE, 40, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addGap(2, 2, 2)
                        .addComponent(jSeparator2, javax.swing.GroupLayout.PREFERRED_SIZE, 10, javax.swing.GroupLayout.PREFERRED_SIZE))
                    .addGroup(jPanel1Layout.createSequentialGroup()
                        .addComponent(lastName, javax.swing.GroupLayout.PREFERRED_SIZE, 40, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addGap(2, 2, 2)
                        .addComponent(jSeparator5, javax.swing.GroupLayout.PREFERRED_SIZE, 10, javax.swing.GroupLayout.PREFERRED_SIZE)))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(jLabel9)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(tfusername, javax.swing.GroupLayout.PREFERRED_SIZE, 40, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(2, 2, 2)
                .addComponent(jSeparator3, javax.swing.GroupLayout.PREFERRED_SIZE, 4, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(jLabel10)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.TRAILING)
                    .addComponent(pfpassword, javax.swing.GroupLayout.PREFERRED_SIZE, 40, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(show)
                    .addComponent(hide))
                .addGap(2, 2, 2)
                .addComponent(jSeparator4, javax.swing.GroupLayout.PREFERRED_SIZE, 4, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(jLabel11)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.TRAILING)
                    .addComponent(cpassword, javax.swing.GroupLayout.PREFERRED_SIZE, 40, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(show1)
                    .addComponent(hide1))
                .addGap(2, 2, 2)
                .addComponent(jSeparator6, javax.swing.GroupLayout.PREFERRED_SIZE, 4, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(LoginLabel)
                    .addComponent(jLabel12))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addComponent(btnRegister, javax.swing.GroupLayout.PREFERRED_SIZE, 40, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(25, 25, 25))
        );

        getContentPane().add(jPanel1, new org.netbeans.lib.awtextra.AbsoluteConstraints(400, 0, -1, -1));

        pack();
        setLocationRelativeTo(null);
    }// </editor-fold>//GEN-END:initComponents

    private void btnRegisterActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_btnRegisterActionPerformed
        String fname = firstName.getText().trim();
        String lname = lastName.getText().trim();
        String username = tfusername.getText().trim();
        String password = pfpassword.getText();
        String confirmpass = cpassword.getText();
    
        if (fname.isEmpty() || lname.isEmpty() || username.isEmpty() || password.isEmpty() || confirmpass.isEmpty()) {
            JOptionPane.showMessageDialog(null, "All fields are required.");
            return;
        }
        if (!password.equals(confirmpass)) {
            JOptionPane.showMessageDialog(null, "Passwords do not match. Try again.");
            clearPasswordFields();
            return;
        }
        if (!password.matches("^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[@$!%*?&+])[A-Za-z\\d@$!%*?&+]{8,}$")) {
            JOptionPane.showMessageDialog(
                rootPane,
                "Password must:\n" +
                "- Be at least 8 characters long\n" +
                "- Contain an uppercase letter, a lowercase letter, a number, and a special character (@, $, !, %, *, ?, &)",
                "Invalid Password",
                JOptionPane.ERROR_MESSAGE
            );
            clearPasswordFields();
            return;
        }
        try {
            String checkUsernameSQL = "SELECT COUNT(*) FROM `user` WHERE `Username` = ?"; // Check if username already exists
            pst = con.prepareStatement(checkUsernameSQL);
            pst.setString(1, username);
            rs = pst.executeQuery();

            if (rs.next() && rs.getInt(1) > 0) {
                JOptionPane.showMessageDialog(null, "Username is already taken.");
                return;
            }
            String insertUserSQL = "INSERT INTO `user` (`First Name`, `Last Name`, `Username`, `Password`) VALUES (?, ?, ?, ?)"; // Insert new user into the database
            pst = con.prepareStatement(insertUserSQL);
            pst.setString(1, fname);
            pst.setString(2, lname);
            pst.setString(3, username);
            pst.setString(4, password);
            
            if (pst.executeUpdate() > 0) {
                JOptionPane.showMessageDialog(null, "Account created successfully! Please log in.");
                clearFields();
                LoginFrame login = new LoginFrame();
                login.setVisible(true);
                this.dispose();
                } else {
                JOptionPane.showMessageDialog(null, "Failed to create an account. Please try again.");
            }
        } catch (SQLException ex) {
            JOptionPane.showMessageDialog(null, "Database error: " + ex.getMessage(), "Error", JOptionPane.ERROR_MESSAGE);
        } 
    }//GEN-LAST:event_btnRegisterActionPerformed

    private void LoginLabelMouseClicked(java.awt.event.MouseEvent evt) {//GEN-FIRST:event_LoginLabelMouseClicked
        LoginFrame login = new LoginFrame();
        login.setVisible(true);
        this.dispose();
    }//GEN-LAST:event_LoginLabelMouseClicked

    private void showMousePressed(java.awt.event.MouseEvent evt) {//GEN-FIRST:event_showMousePressed
        hide.setVisible(true);
        show.setVisible(false);
        pfpassword.setEchoChar((char)0);
    }//GEN-LAST:event_showMousePressed

    private void hideMousePressed(java.awt.event.MouseEvent evt) {//GEN-FIRST:event_hideMousePressed
        hide.setVisible(false);
        show.setVisible(true);
        pfpassword.setEchoChar('•');
    }//GEN-LAST:event_hideMousePressed

    private void hide1MousePressed(java.awt.event.MouseEvent evt) {//GEN-FIRST:event_hide1MousePressed
        hide1.setVisible(false);
        show1.setVisible(true);
        cpassword.setEchoChar('•');
    }//GEN-LAST:event_hide1MousePressed

    private void show1MousePressed(java.awt.event.MouseEvent evt) {//GEN-FIRST:event_show1MousePressed
        hide1.setVisible(true);
        show1.setVisible(false);
        cpassword.setEchoChar((char)0);
    }//GEN-LAST:event_show1MousePressed
    public static void main(String args[]) {
        java.awt.EventQueue.invokeLater(new Runnable() {
            @Override
            public void run() {
                RegistrationFrame register = new RegistrationFrame();
                register.setVisible(true);
            }
        });
    }
    // Variables declaration - do not modify//GEN-BEGIN:variables
    private javax.swing.JLabel LoginLabel;
    private javax.swing.JLabel LogoName;
    private javax.swing.JButton btnRegister;
    private javax.swing.JPasswordField cpassword;
    private javax.swing.JTextField firstName;
    private javax.swing.JLabel hide;
    private javax.swing.JLabel hide1;
    private javax.swing.JLabel jLabel1;
    private javax.swing.JLabel jLabel10;
    private javax.swing.JLabel jLabel11;
    private javax.swing.JLabel jLabel12;
    private javax.swing.JLabel jLabel2;
    private javax.swing.JLabel jLabel3;
    private javax.swing.JLabel jLabel4;
    private javax.swing.JLabel jLabel7;
    private javax.swing.JLabel jLabel8;
    private javax.swing.JLabel jLabel9;
    private javax.swing.JPanel jPanel1;
    private javax.swing.JPanel jPanel2;
    private javax.swing.JPanel jPanel3;
    private javax.swing.JSeparator jSeparator2;
    private javax.swing.JSeparator jSeparator3;
    private javax.swing.JSeparator jSeparator4;
    private javax.swing.JSeparator jSeparator5;
    private javax.swing.JSeparator jSeparator6;
    private javax.swing.JTextField lastName;
    private javax.swing.JPasswordField pfpassword;
    private javax.swing.JLabel show;
    private javax.swing.JLabel show1;
    private javax.swing.JTextField tfusername;
    // End of variables declaration//GEN-END:variables
}