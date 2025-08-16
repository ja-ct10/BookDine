package servos;

import java.awt.Toolkit;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import javax.swing.table.DefaultTableModel;
import java.sql.SQLException;
import javax.swing.JOptionPane;
import javax.swing.RowFilter;
import javax.swing.table.TableRowSorter;

public class DeletedReservation extends javax.swing.JFrame {

private Connection con = DatabaseConnection.getConnection();;
    private Dashboard dashboard;
    
    public DeletedReservation(Dashboard dashboard) {
        this.dashboard = dashboard;
        initComponents();
        setIconImage();
        loadDeletedReservations();
        
        if (con == null) {
            JOptionPane.showMessageDialog(this, "Failed to connect to the database.", "Database Error", JOptionPane.ERROR_MESSAGE);
        }
    }
    private void setIconImage() {
        setIconImage(Toolkit.getDefaultToolkit().getImage(getClass().getResource("/ICON/logo1.png")));

    }
    public void search(String names) {
        DefaultTableModel model = (DefaultTableModel) DeletedTable.getModel();
        TableRowSorter<DefaultTableModel> trs = new TableRowSorter<>(model);
        DeletedTable.setRowSorter(trs);
        trs.setRowFilter(RowFilter.regexFilter("(?i)" + names, 1, 2)); 
    }
    private void loadDeletedReservations() {
        DefaultTableModel model = (DefaultTableModel) DeletedTable.getModel();
        model.setRowCount(0); 

        String selectQuery = "SELECT * FROM backup"; // Query to select all rows from the backup table
        try (PreparedStatement pst = con.prepareStatement(selectQuery);
             ResultSet rs = pst.executeQuery()) {
            
            while (rs.next()) {
                model.addRow(new Object[]{
                    rs.getString("Id"),
                    rs.getString("Firstname"),
                    rs.getString("Lastname"),
                    rs.getString("Date"),
                    rs.getString("Arrival Time"),
                    rs.getString("Departure Time"),
                    rs.getString("Table Number"),
                    rs.getString("Contact Number"),
                    rs.getString("Status")
                });
            }
        } catch (SQLException ex) {
            javax.swing.JOptionPane.showMessageDialog(null, "Database error: " + ex.getMessage());
        }
    }
    @SuppressWarnings("unchecked")
    // <editor-fold defaultstate="collapsed" desc="Generated Code">//GEN-BEGIN:initComponents
    private void initComponents() {

        jPanel1 = new javax.swing.JPanel();
        jPanel2 = new javax.swing.JPanel();
        jLabel4 = new javax.swing.JLabel();
        jLabel10 = new javax.swing.JLabel();
        jLabel1 = new javax.swing.JLabel();
        ExitBtn = new javax.swing.JLabel();
        jScrollPane2 = new javax.swing.JScrollPane();
        DeletedTable = new javax.swing.JTable();
        BtnRestore = new javax.swing.JButton();
        SearchField = new javax.swing.JTextField();
        SearchBtn = new javax.swing.JLabel();

        setDefaultCloseOperation(javax.swing.WindowConstants.EXIT_ON_CLOSE);
        setUndecorated(true);

        jPanel1.setBackground(new java.awt.Color(255, 255, 255));

        jPanel2.setBackground(new java.awt.Color(95, 54, 29));

        jLabel4.setIcon(new javax.swing.ImageIcon(getClass().getResource("/ICON/logo-2.png"))); // NOI18N

        jLabel10.setFont(new java.awt.Font("Book Antiqua", 1, 24)); // NOI18N
        jLabel10.setForeground(new java.awt.Color(245, 244, 230));
        jLabel10.setText("S E R V O S");

        jLabel1.setFont(new java.awt.Font("Ebrima", 1, 20)); // NOI18N
        jLabel1.setForeground(new java.awt.Color(255, 255, 255));
        jLabel1.setHorizontalAlignment(javax.swing.SwingConstants.CENTER);
        jLabel1.setText("Deleted and Cancelled Reservation");

        ExitBtn.setIcon(new javax.swing.ImageIcon(getClass().getResource("/ICON/exit button.png"))); // NOI18N
        ExitBtn.addMouseListener(new java.awt.event.MouseAdapter() {
            public void mousePressed(java.awt.event.MouseEvent evt) {
                ExitBtnMousePressed(evt);
            }
        });

        javax.swing.GroupLayout jPanel2Layout = new javax.swing.GroupLayout(jPanel2);
        jPanel2.setLayout(jPanel2Layout);
        jPanel2Layout.setHorizontalGroup(
            jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel2Layout.createSequentialGroup()
                .addContainerGap()
                .addComponent(jLabel4, javax.swing.GroupLayout.PREFERRED_SIZE, 59, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(jLabel10)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED, 434, Short.MAX_VALUE)
                .addComponent(jLabel1)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(ExitBtn)
                .addContainerGap())
        );
        jPanel2Layout.setVerticalGroup(
            jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel2Layout.createSequentialGroup()
                .addGap(4, 4, 4)
                .addGroup(jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(jPanel2Layout.createSequentialGroup()
                        .addGroup(jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addGroup(jPanel2Layout.createSequentialGroup()
                                .addGap(13, 13, 13)
                                .addComponent(jLabel1))
                            .addComponent(ExitBtn))
                        .addGap(0, 0, Short.MAX_VALUE))
                    .addGroup(jPanel2Layout.createSequentialGroup()
                        .addGap(13, 13, 13)
                        .addComponent(jLabel10)
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED, 17, javax.swing.GroupLayout.PREFERRED_SIZE))
                    .addComponent(jLabel4, javax.swing.GroupLayout.PREFERRED_SIZE, 0, Short.MAX_VALUE))
                .addContainerGap())
        );

        DeletedTable.setBackground(new java.awt.Color(252, 250, 238));
        DeletedTable.setFont(new java.awt.Font("Franklin Gothic Book", 0, 14)); // NOI18N
        DeletedTable.setModel(new javax.swing.table.DefaultTableModel(
            new Object [][] {
                {null, null, null, null, null, null, null, null, null},
                {null, null, null, null, null, null, null, null, null},
                {null, null, null, null, null, null, null, null, null},
                {null, null, null, null, null, null, null, null, null}
            },
            new String [] {
                "Id", "First Name", "Last Name", "Date", "Arrival Time", "Departure Time", "Table Number", "Contact Number", "Status"
            }
        ) {
            boolean[] canEdit = new boolean [] {
                false, false, false, false, false, false, false, false, false
            };

            public boolean isCellEditable(int rowIndex, int columnIndex) {
                return canEdit [columnIndex];
            }
        });
        DeletedTable.getTableHeader().setResizingAllowed(false);
        DeletedTable.getTableHeader().setReorderingAllowed(false);
        jScrollPane2.setViewportView(DeletedTable);

        BtnRestore.setBackground(new java.awt.Color(0, 191, 99));
        BtnRestore.setFont(new java.awt.Font("Tahoma", 1, 18)); // NOI18N
        BtnRestore.setForeground(new java.awt.Color(255, 255, 255));
        BtnRestore.setText("Restore");
        BtnRestore.setBorder(null);
        BtnRestore.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                BtnRestoreActionPerformed(evt);
            }
        });

        SearchField.setFont(new java.awt.Font("Tahoma", 0, 12)); // NOI18N
        SearchField.setText("Search for customer");
        SearchField.addKeyListener(new java.awt.event.KeyAdapter() {
            public void keyReleased(java.awt.event.KeyEvent evt) {
                SearchFieldKeyReleased(evt);
            }
        });

        SearchBtn.setIcon(new javax.swing.ImageIcon(getClass().getResource("/ICON/search.png"))); // NOI18N

        javax.swing.GroupLayout jPanel1Layout = new javax.swing.GroupLayout(jPanel1);
        jPanel1.setLayout(jPanel1Layout);
        jPanel1Layout.setHorizontalGroup(
            jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addComponent(jPanel2, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
            .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, jPanel1Layout.createSequentialGroup()
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.TRAILING)
                    .addGroup(jPanel1Layout.createSequentialGroup()
                        .addGap(430, 430, 430)
                        .addComponent(BtnRestore, javax.swing.GroupLayout.PREFERRED_SIZE, 140, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                        .addComponent(SearchField, javax.swing.GroupLayout.PREFERRED_SIZE, 200, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                        .addComponent(SearchBtn))
                    .addGroup(jPanel1Layout.createSequentialGroup()
                        .addContainerGap(42, Short.MAX_VALUE)
                        .addComponent(jScrollPane2, javax.swing.GroupLayout.PREFERRED_SIZE, 943, javax.swing.GroupLayout.PREFERRED_SIZE)))
                .addGap(37, 37, 37))
        );
        jPanel1Layout.setVerticalGroup(
            jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel1Layout.createSequentialGroup()
                .addComponent(jPanel2, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(37, 37, 37)
                .addComponent(jScrollPane2, javax.swing.GroupLayout.PREFERRED_SIZE, 466, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(30, 30, 30)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(BtnRestore, javax.swing.GroupLayout.PREFERRED_SIZE, 45, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.TRAILING, false)
                        .addComponent(SearchField)
                        .addComponent(SearchBtn, javax.swing.GroupLayout.Alignment.LEADING)))
                .addContainerGap(28, Short.MAX_VALUE))
        );

        javax.swing.GroupLayout layout = new javax.swing.GroupLayout(getContentPane());
        getContentPane().setLayout(layout);
        layout.setHorizontalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addComponent(jPanel1, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
        );
        layout.setVerticalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addComponent(jPanel1, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
        );

        pack();
        setLocationRelativeTo(null);
    }// </editor-fold>//GEN-END:initComponents

    private void ExitBtnMousePressed(java.awt.event.MouseEvent evt) {//GEN-FIRST:event_ExitBtnMousePressed
        this.dispose();
        dashboard.setVisible(true);
        dashboard.getTabbedPane().setSelectedIndex(2);
        dashboard.refreshTab(5);
    }//GEN-LAST:event_ExitBtnMousePressed

    private void BtnRestoreActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_BtnRestoreActionPerformed
        int selectedRow = DeletedTable.getSelectedRow();

        if (selectedRow == -1) {
            javax.swing.JOptionPane.showMessageDialog(null, "Please select a row to restore.");
            return;
        }
        String status = DeletedTable.getValueAt(selectedRow, 8).toString();
        if (!"Pending".equals(status)) {
           javax.swing.JOptionPane.showMessageDialog(null, "You can only restore Pending reservations.");
            return;
        }
        Object[] rowData = new Object[9];
        for (int i = 0; i < rowData.length; i++) {
            rowData[i] = DeletedTable.getValueAt(selectedRow, i);
        }
        String restoreQuery = "INSERT INTO `customer_reservation` (`Id`, `Date`, `Arrival Time`, `Departure Time`, `Firstname`, `Lastname`, `Table Number`, `Contact Number`, `Status`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        String deleteQuery = "DELETE FROM backup WHERE Id = ?";
        try (
            PreparedStatement pst = con.prepareStatement(restoreQuery);
            PreparedStatement deletePst = con.prepareStatement(deleteQuery)
            ) {
            pst.setString(1, rowData[0].toString());  // Id
            pst.setString(2, rowData[3].toString());  // Date 
            pst.setString(3, rowData[4].toString());  // Arrival Time (index 4)
            pst.setString(4, rowData[5].toString());  // Departure Time (index 5)
            pst.setString(5, rowData[1].toString());  // Firstname (index 1)
            pst.setString(6, rowData[2].toString());  // Lastname (index 2)
            pst.setString(7, rowData[6].toString());  // Table Number (index 6)
            pst.setString(8, rowData[7].toString());  // Contact Number (index 7)
            pst.setString(9, rowData[8].toString());  // Status (index 8)

            int result = pst.executeUpdate();
            if (result > 0) {
                deletePst.setString(1, rowData[0].toString());
                deletePst.executeUpdate();

                ((DefaultTableModel) DeletedTable.getModel()).removeRow(selectedRow);
                javax.swing.JOptionPane.showMessageDialog(null, "Reservation restored successfully.");
            }
        } catch (SQLException ex) {
            javax.swing.JOptionPane.showMessageDialog(null, "Database error: " + ex.getMessage());
        }
    }//GEN-LAST:event_BtnRestoreActionPerformed

    private void SearchFieldKeyReleased(java.awt.event.KeyEvent evt) {//GEN-FIRST:event_SearchFieldKeyReleased
        String searchNames = SearchField.getText();
        search(searchNames);
    }//GEN-LAST:event_SearchFieldKeyReleased
    public static void main(String args[]) {
        java.awt.EventQueue.invokeLater(() -> {
            Dashboard dashboard = new Dashboard();
            DeletedReservation dr = new DeletedReservation(dashboard);
            dr.setVisible(true);
        });
    }
    // Variables declaration - do not modify//GEN-BEGIN:variables
    private javax.swing.JButton BtnRestore;
    private javax.swing.JTable DeletedTable;
    private javax.swing.JLabel ExitBtn;
    private javax.swing.JLabel SearchBtn;
    private javax.swing.JTextField SearchField;
    private javax.swing.JLabel jLabel1;
    private javax.swing.JLabel jLabel10;
    private javax.swing.JLabel jLabel4;
    private javax.swing.JPanel jPanel1;
    private javax.swing.JPanel jPanel2;
    private javax.swing.JScrollPane jScrollPane2;
    // End of variables declaration//GEN-END:variables
}