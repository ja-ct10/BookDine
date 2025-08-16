package servos;

import java.awt.Toolkit;

public class TableFrame extends javax.swing.JFrame {
    
    private String tableNumber;
    private Dashboard dashboard; 
   
    public TableFrame(Dashboard dashboard, String tableNumber) {
        this.dashboard = dashboard;
        this.tableNumber = tableNumber;
        setIconImage();
        initComponents();
        ChosenTable.setText(tableNumber);
    }  
    public void setReservationDetails(String firstName, String lastName, String arrivalTime, String departureTime) {
        fname.setText(firstName);
        lname.setText(lastName);
        atime.setText(arrivalTime);
        dtime.setText(departureTime);
    }
    private void setIconImage() {
        setIconImage(Toolkit.getDefaultToolkit().getImage(getClass().getResource("/ICON/logo1.png")));
    }
    @SuppressWarnings("unchecked")
    // <editor-fold defaultstate="collapsed" desc="Generated Code">//GEN-BEGIN:initComponents
    private void initComponents() {

        jPanel1 = new javax.swing.JPanel();
        jPanel2 = new javax.swing.JPanel();
        jLabel2 = new javax.swing.JLabel();
        jLabel6 = new javax.swing.JLabel();
        fname = new javax.swing.JLabel();
        jLabel8 = new javax.swing.JLabel();
        lname = new javax.swing.JLabel();
        atime = new javax.swing.JLabel();
        dtime = new javax.swing.JLabel();
        jLabel1 = new javax.swing.JLabel();
        jLabel3 = new javax.swing.JLabel();
        jLabel5 = new javax.swing.JLabel();
        jLabel7 = new javax.swing.JLabel();
        jSeparator1 = new javax.swing.JSeparator();
        jPanel3 = new javax.swing.JPanel();
        jLabel4 = new javax.swing.JLabel();
        jLabel10 = new javax.swing.JLabel();
        ExitBtn = new javax.swing.JLabel();
        ChosenTable = new javax.swing.JLabel();

        setDefaultCloseOperation(javax.swing.WindowConstants.EXIT_ON_CLOSE);
        setUndecorated(true);

        jPanel1.setBackground(new java.awt.Color(246, 239, 189));
        jPanel1.setLayout(new org.netbeans.lib.awtextra.AbsoluteLayout());

        jPanel2.setBackground(new java.awt.Color(255, 255, 255));
        jPanel2.setLayout(new org.netbeans.lib.awtextra.AbsoluteLayout());

        jLabel2.setFont(new java.awt.Font("Tahoma", 1, 18)); // NOI18N
        jLabel2.setText("Table Status");
        jPanel2.add(jLabel2, new org.netbeans.lib.awtextra.AbsoluteConstraints(150, 30, -1, -1));

        jLabel6.setFont(new java.awt.Font("Tahoma", 1, 18)); // NOI18N
        jLabel6.setText("Current Customer:");
        jPanel2.add(jLabel6, new org.netbeans.lib.awtextra.AbsoluteConstraints(50, 260, 180, -1));

        fname.setFont(new java.awt.Font("Tahoma", 0, 12)); // NOI18N
        jPanel2.add(fname, new org.netbeans.lib.awtextra.AbsoluteConstraints(180, 300, 180, 30));

        jLabel8.setIcon(new javax.swing.ImageIcon(getClass().getResource("/ICON/clock.png"))); // NOI18N
        jPanel2.add(jLabel8, new org.netbeans.lib.awtextra.AbsoluteConstraints(100, 60, 215, 194));

        lname.setFont(new java.awt.Font("Tahoma", 0, 12)); // NOI18N
        jPanel2.add(lname, new org.netbeans.lib.awtextra.AbsoluteConstraints(180, 330, 180, 30));

        atime.setFont(new java.awt.Font("Tahoma", 0, 12)); // NOI18N
        jPanel2.add(atime, new org.netbeans.lib.awtextra.AbsoluteConstraints(180, 360, 200, 30));

        dtime.setFont(new java.awt.Font("Tahoma", 0, 12)); // NOI18N
        jPanel2.add(dtime, new org.netbeans.lib.awtextra.AbsoluteConstraints(180, 390, 200, 30));

        jLabel1.setFont(new java.awt.Font("Tahoma", 0, 14)); // NOI18N
        jLabel1.setText("Departure Time:");
        jPanel2.add(jLabel1, new org.netbeans.lib.awtextra.AbsoluteConstraints(50, 390, -1, 30));

        jLabel3.setFont(new java.awt.Font("Tahoma", 0, 14)); // NOI18N
        jLabel3.setText("First Name:");
        jPanel2.add(jLabel3, new org.netbeans.lib.awtextra.AbsoluteConstraints(50, 300, -1, 30));

        jLabel5.setFont(new java.awt.Font("Tahoma", 0, 14)); // NOI18N
        jLabel5.setText("Last Name:");
        jPanel2.add(jLabel5, new org.netbeans.lib.awtextra.AbsoluteConstraints(50, 330, -1, 30));

        jLabel7.setFont(new java.awt.Font("Tahoma", 0, 14)); // NOI18N
        jLabel7.setText("Arrival Time:");
        jPanel2.add(jLabel7, new org.netbeans.lib.awtextra.AbsoluteConstraints(50, 360, -1, 30));

        jSeparator1.setForeground(new java.awt.Color(0, 0, 0));
        jPanel2.add(jSeparator1, new org.netbeans.lib.awtextra.AbsoluteConstraints(50, 280, 180, 10));

        jPanel1.add(jPanel2, new org.netbeans.lib.awtextra.AbsoluteConstraints(40, 110, 420, 460));

        jPanel3.setBackground(new java.awt.Color(95, 54, 29));

        jLabel4.setIcon(new javax.swing.ImageIcon(getClass().getResource("/ICON/logo-2.png"))); // NOI18N

        jLabel10.setFont(new java.awt.Font("Book Antiqua", 1, 24)); // NOI18N
        jLabel10.setForeground(new java.awt.Color(245, 244, 230));
        jLabel10.setText("S E R V O S");

        ExitBtn.setIcon(new javax.swing.ImageIcon(getClass().getResource("/ICON/exit button.png"))); // NOI18N
        ExitBtn.addMouseListener(new java.awt.event.MouseAdapter() {
            public void mousePressed(java.awt.event.MouseEvent evt) {
                ExitBtnMousePressed(evt);
            }
        });

        ChosenTable.setFont(new java.awt.Font("Ebrima", 1, 20)); // NOI18N
        ChosenTable.setForeground(new java.awt.Color(255, 255, 255));
        ChosenTable.setHorizontalAlignment(javax.swing.SwingConstants.CENTER);

        javax.swing.GroupLayout jPanel3Layout = new javax.swing.GroupLayout(jPanel3);
        jPanel3.setLayout(jPanel3Layout);
        jPanel3Layout.setHorizontalGroup(
            jPanel3Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel3Layout.createSequentialGroup()
                .addComponent(jLabel4, javax.swing.GroupLayout.PREFERRED_SIZE, 59, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(jLabel10)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED, 122, Short.MAX_VALUE)
                .addComponent(ChosenTable, javax.swing.GroupLayout.PREFERRED_SIZE, 122, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(ExitBtn)
                .addContainerGap())
        );
        jPanel3Layout.setVerticalGroup(
            jPanel3Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel3Layout.createSequentialGroup()
                .addContainerGap()
                .addGroup(jPanel3Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(jLabel4, javax.swing.GroupLayout.PREFERRED_SIZE, 0, Short.MAX_VALUE)
                    .addGroup(jPanel3Layout.createSequentialGroup()
                        .addComponent(ExitBtn)
                        .addGap(0, 10, Short.MAX_VALUE)))
                .addContainerGap())
            .addGroup(jPanel3Layout.createSequentialGroup()
                .addGap(16, 16, 16)
                .addGroup(jPanel3Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(ChosenTable, javax.swing.GroupLayout.PREFERRED_SIZE, 30, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(jLabel10))
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
        );

        jPanel1.add(jPanel3, new org.netbeans.lib.awtextra.AbsoluteConstraints(0, 0, 500, 70));

        javax.swing.GroupLayout layout = new javax.swing.GroupLayout(getContentPane());
        getContentPane().setLayout(layout);
        layout.setHorizontalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addComponent(jPanel1, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
        );
        layout.setVerticalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(layout.createSequentialGroup()
                .addComponent(jPanel1, javax.swing.GroupLayout.PREFERRED_SIZE, 600, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(0, 0, Short.MAX_VALUE))
        );

        pack();
        setLocationRelativeTo(null);
    }// </editor-fold>//GEN-END:initComponents

    private void ExitBtnMousePressed(java.awt.event.MouseEvent evt) {//GEN-FIRST:event_ExitBtnMousePressed
        this.dispose();
        dashboard.setVisible(true);
        dashboard.getTabbedPane().setSelectedIndex(1); 
        dashboard.refreshTab(5);
    }//GEN-LAST:event_ExitBtnMousePressed
    public static void main(String args[]) {
        java.awt.EventQueue.invokeLater(() -> {
            Dashboard dashboard = new Dashboard();
            String tableNumber = "Table No. 1"; // You can choose any table number here
            TableFrame tf = new TableFrame(dashboard, tableNumber);
            tf.setVisible(true);
        });
    }
    // Variables declaration - do not modify//GEN-BEGIN:variables
    private javax.swing.JLabel ChosenTable;
    private javax.swing.JLabel ExitBtn;
    private javax.swing.JLabel atime;
    private javax.swing.JLabel dtime;
    private javax.swing.JLabel fname;
    private javax.swing.JLabel jLabel1;
    private javax.swing.JLabel jLabel10;
    private javax.swing.JLabel jLabel2;
    private javax.swing.JLabel jLabel3;
    private javax.swing.JLabel jLabel4;
    private javax.swing.JLabel jLabel5;
    private javax.swing.JLabel jLabel6;
    private javax.swing.JLabel jLabel7;
    private javax.swing.JLabel jLabel8;
    private javax.swing.JPanel jPanel1;
    private javax.swing.JPanel jPanel2;
    private javax.swing.JPanel jPanel3;
    private javax.swing.JSeparator jSeparator1;
    private javax.swing.JLabel lname;
    // End of variables declaration//GEN-END:variables
}