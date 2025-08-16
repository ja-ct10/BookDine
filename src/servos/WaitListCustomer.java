package servos;

import java.awt.Toolkit;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import javax.swing.JOptionPane;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.text.ParseException;
import java.util.Date;

public class WaitListCustomer extends javax.swing.JFrame {
    
    Connection con = DatabaseConnection.getConnection();;
    ResultSet rs = null;
    PreparedStatement pst = null;
    
    private Dashboard dashboard;
    private reservedTable r = null;
    private boolean departureTimeMessageShown = false;
    
    public WaitListCustomer(Dashboard dashboard) {
        initComponents();
        this.dashboard = dashboard;
        setIconImage();
        initializeDateChooser();
        initializeTimer();
        if (con == null) {
            JOptionPane.showMessageDialog(this, "Failed to connect to the database.", "Database Error", JOptionPane.ERROR_MESSAGE);
        }
    }
    private void setIconImage() {
        setIconImage(Toolkit.getDefaultToolkit().getImage(getClass().getResource("/ICON/logo1.png")));
    }
    public WaitListCustomer() {
        initComponents();
        initializeDateChooser();
        initializeTimer();
    }
    public void updateTableNumber(String tableNumber) {
        tablenum.setSelectedItem(tableNumber);
    }
    private void clearInputFields() {
        Firstname.setText("");           // Clear first name field
        Lastname.setText("");            // Clear last name field
        departureTime.setText("");       // Clear departure time field
        tablenum.setSelectedIndex(0);    // Reset table number dropdown to first option
        contactNumber.setText("");       // Clear contact number field
    }
    private void initializeDateChooser() {
        date.setDate(new Date());
        date.getDateEditor().setEnabled(false);
    }
    private void initializeTimer() {
        SimpleDateFormat timeFormat = new SimpleDateFormat("HH:mm");
        javax.swing.Timer timer = new javax.swing.Timer(1000, e -> { // Create a timer to update the arrival time field every second
            Date currentDate = new Date();
            arrivalTime.setText(timeFormat.format(currentDate)); // Update arrival time field
        });
        timer.start(); // Start the timer
    }
    private boolean isTableAvailable(String dateReserve, String tablenumber, String timeArrival, String timeDeparture) throws SQLException {
        String checkTableQuery = "SELECT * FROM  customer_reservation WHERE `Date` = ? AND `Table Number` = ? " +
                                  "AND ((`Arrival Time` < ? AND `Departure Time` > ?) OR (`Arrival Time` < ? AND `Departure Time` > ?) " +
                                  "OR (`Arrival Time` BETWEEN ? AND ?) OR (`Departure Time` BETWEEN ? AND ?))";
        pst = con.prepareStatement(checkTableQuery);
        pst.setString(1, dateReserve);
        pst.setString(2, tablenumber);
        pst.setString(3, timeArrival); 
        pst.setString(4, timeArrival); 
        pst.setString(5, timeDeparture); 
        pst.setString(6, timeDeparture); 
        pst.setString(7, timeArrival); 
        pst.setString(8, timeDeparture); 
        pst.setString(9, timeArrival); 
        pst.setString(10, timeDeparture); 
        rs = pst.executeQuery();

        return !rs.next(); 
    }
    @SuppressWarnings("unchecked")
    // <editor-fold defaultstate="collapsed" desc="Generated Code">//GEN-BEGIN:initComponents
    private void initComponents() {

        jPanel1 = new javax.swing.JPanel();
        date = new com.toedter.calendar.JDateChooser();
        jLabel12 = new javax.swing.JLabel();
        jPanel2 = new javax.swing.JPanel();
        jLabel2 = new javax.swing.JLabel();
        jLabel10 = new javax.swing.JLabel();
        jLabel1 = new javax.swing.JLabel();
        ExitBtn = new javax.swing.JLabel();
        BtnAddCustomer = new javax.swing.JButton();
        jLabel13 = new javax.swing.JLabel();
        Firstname = new javax.swing.JTextField();
        jSeparator1 = new javax.swing.JSeparator();
        jLabel14 = new javax.swing.JLabel();
        Lastname = new javax.swing.JTextField();
        jSeparator2 = new javax.swing.JSeparator();
        jLabel15 = new javax.swing.JLabel();
        jLabel16 = new javax.swing.JLabel();
        tablenum = new javax.swing.JComboBox<>();
        jLabel17 = new javax.swing.JLabel();
        contactNumber = new javax.swing.JTextField();
        jSeparator3 = new javax.swing.JSeparator();
        BtnClear = new javax.swing.JButton();
        jLabel3 = new javax.swing.JLabel();
        jLabel18 = new javax.swing.JLabel();
        arrivalTime = new javax.swing.JFormattedTextField();
        departureTime = new javax.swing.JFormattedTextField();

        setDefaultCloseOperation(javax.swing.WindowConstants.EXIT_ON_CLOSE);
        setUndecorated(true);

        jPanel1.setBackground(new java.awt.Color(252, 250, 238));
        jPanel1.setLayout(new org.netbeans.lib.awtextra.AbsoluteLayout());

        date.setBackground(new java.awt.Color(255, 255, 255));
        jPanel1.add(date, new org.netbeans.lib.awtextra.AbsoluteConstraints(110, 130, 230, 43));

        jLabel12.setFont(new java.awt.Font("Franklin Gothic Book", 1, 20)); // NOI18N
        jLabel12.setText("Last Name:");
        jPanel1.add(jLabel12, new org.netbeans.lib.awtextra.AbsoluteConstraints(400, 230, -1, -1));

        jPanel2.setBackground(new java.awt.Color(95, 54, 29));

        jLabel2.setIcon(new javax.swing.ImageIcon(getClass().getResource("/ICON/logo-2.png"))); // NOI18N

        jLabel10.setFont(new java.awt.Font("Book Antiqua", 1, 24)); // NOI18N
        jLabel10.setForeground(new java.awt.Color(245, 244, 230));
        jLabel10.setText("S E R V O S");

        jLabel1.setFont(new java.awt.Font("Ebrima", 1, 20)); // NOI18N
        jLabel1.setForeground(new java.awt.Color(255, 255, 255));
        jLabel1.setText("Add Customer");

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
                .addComponent(jLabel2)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(jLabel10)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED, 406, Short.MAX_VALUE)
                .addComponent(jLabel1)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(ExitBtn)
                .addGap(9, 9, 9))
        );
        jPanel2Layout.setVerticalGroup(
            jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel2Layout.createSequentialGroup()
                .addGroup(jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING, false)
                    .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, jPanel2Layout.createSequentialGroup()
                        .addContainerGap()
                        .addComponent(jLabel2, javax.swing.GroupLayout.PREFERRED_SIZE, 63, javax.swing.GroupLayout.PREFERRED_SIZE))
                    .addGroup(jPanel2Layout.createSequentialGroup()
                        .addGap(9, 9, 9)
                        .addGroup(jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.TRAILING)
                            .addComponent(ExitBtn)
                            .addGroup(jPanel2Layout.createSequentialGroup()
                                .addGroup(jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                                    .addComponent(jLabel10)
                                    .addComponent(jLabel1))
                                .addGap(8, 8, 8)))
                        .addGap(14, 14, 14)))
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
        );

        jPanel1.add(jPanel2, new org.netbeans.lib.awtextra.AbsoluteConstraints(0, 0, 800, 70));

        BtnAddCustomer.setBackground(new java.awt.Color(250, 207, 16));
        BtnAddCustomer.setFont(new java.awt.Font("Tahoma", 1, 18)); // NOI18N
        BtnAddCustomer.setForeground(new java.awt.Color(255, 255, 255));
        BtnAddCustomer.setText("+ Add Customer");
        BtnAddCustomer.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                BtnAddCustomerActionPerformed(evt);
            }
        });
        jPanel1.add(BtnAddCustomer, new org.netbeans.lib.awtextra.AbsoluteConstraints(410, 410, 190, 50));

        jLabel13.setFont(new java.awt.Font("Franklin Gothic Book", 1, 20)); // NOI18N
        jLabel13.setText("Date:");
        jPanel1.add(jLabel13, new org.netbeans.lib.awtextra.AbsoluteConstraints(50, 140, -1, -1));

        Firstname.setBackground(new java.awt.Color(252, 250, 238));
        Firstname.setBorder(null);
        jPanel1.add(Firstname, new org.netbeans.lib.awtextra.AbsoluteConstraints(160, 220, 210, 40));

        jSeparator1.setForeground(new java.awt.Color(0, 0, 0));
        jPanel1.add(jSeparator1, new org.netbeans.lib.awtextra.AbsoluteConstraints(160, 260, 210, -1));

        jLabel14.setFont(new java.awt.Font("Franklin Gothic Book", 1, 20)); // NOI18N
        jLabel14.setText("First Name:");
        jPanel1.add(jLabel14, new org.netbeans.lib.awtextra.AbsoluteConstraints(50, 230, -1, -1));

        Lastname.setBackground(new java.awt.Color(252, 250, 238));
        Lastname.setBorder(null);
        jPanel1.add(Lastname, new org.netbeans.lib.awtextra.AbsoluteConstraints(510, 220, 210, 40));

        jSeparator2.setForeground(new java.awt.Color(0, 0, 0));
        jPanel1.add(jSeparator2, new org.netbeans.lib.awtextra.AbsoluteConstraints(510, 260, 210, -1));

        jLabel15.setFont(new java.awt.Font("Franklin Gothic Book", 1, 20)); // NOI18N
        jLabel15.setText("Departure Time:");
        jPanel1.add(jLabel15, new org.netbeans.lib.awtextra.AbsoluteConstraints(400, 160, -1, -1));

        jLabel16.setFont(new java.awt.Font("Franklin Gothic Book", 1, 20)); // NOI18N
        jLabel16.setText("Table Number:");
        jPanel1.add(jLabel16, new org.netbeans.lib.awtextra.AbsoluteConstraints(50, 310, 140, -1));

        tablenum.setFont(new java.awt.Font("Tahoma", 0, 13)); // NOI18N
        tablenum.setModel(new javax.swing.DefaultComboBoxModel<>(new String[] { "Pick a table", "Table No. 1", "Table No. 2", "Table No. 3", "Table No. 4", "Table No. 5", "Table No. 6", "Table No. 7", "Table No. 8", "Table No. 9", "Table No. 10", "Table No. 11", "Table No. 12", "Table No. 13", "Table No. 14", "Table No. 15" }));
        tablenum.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                tablenumActionPerformed(evt);
            }
        });
        jPanel1.add(tablenum, new org.netbeans.lib.awtextra.AbsoluteConstraints(190, 300, 100, 43));

        jLabel17.setFont(new java.awt.Font("Franklin Gothic Book", 1, 20)); // NOI18N
        jLabel17.setText("Contact Number:");
        jPanel1.add(jLabel17, new org.netbeans.lib.awtextra.AbsoluteConstraints(350, 310, -1, -1));

        contactNumber.setBackground(new java.awt.Color(252, 250, 238));
        contactNumber.setBorder(null);
        jPanel1.add(contactNumber, new org.netbeans.lib.awtextra.AbsoluteConstraints(510, 300, 210, 40));

        jSeparator3.setForeground(new java.awt.Color(0, 0, 0));
        jPanel1.add(jSeparator3, new org.netbeans.lib.awtextra.AbsoluteConstraints(510, 340, 210, -1));

        BtnClear.setBackground(new java.awt.Color(255, 49, 49));
        BtnClear.setFont(new java.awt.Font("Tahoma", 1, 18)); // NOI18N
        BtnClear.setForeground(new java.awt.Color(255, 255, 255));
        BtnClear.setText("Clear");
        BtnClear.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                BtnClearActionPerformed(evt);
            }
        });
        jPanel1.add(BtnClear, new org.netbeans.lib.awtextra.AbsoluteConstraints(640, 410, 120, 50));

        jLabel3.setIcon(new javax.swing.ImageIcon(getClass().getResource("/ICON/chef hat.png"))); // NOI18N
        jPanel1.add(jLabel3, new org.netbeans.lib.awtextra.AbsoluteConstraints(30, 360, 280, 120));

        jLabel18.setFont(new java.awt.Font("Franklin Gothic Book", 1, 20)); // NOI18N
        jLabel18.setText("Arrival Time:");
        jPanel1.add(jLabel18, new org.netbeans.lib.awtextra.AbsoluteConstraints(400, 100, -1, -1));

        arrivalTime.setEditable(false);
        try {
            arrivalTime.setFormatterFactory(new javax.swing.text.DefaultFormatterFactory(new javax.swing.text.MaskFormatter("##:##")));
        } catch (java.text.ParseException ex) {
            ex.printStackTrace();
        }
        jPanel1.add(arrivalTime, new org.netbeans.lib.awtextra.AbsoluteConstraints(560, 90, 130, 40));

        try {
            departureTime.setFormatterFactory(new javax.swing.text.DefaultFormatterFactory(new javax.swing.text.MaskFormatter("##:##")));
        } catch (java.text.ParseException ex) {
            ex.printStackTrace();
        }
        departureTime.addFocusListener(new java.awt.event.FocusAdapter() {
            public void focusGained(java.awt.event.FocusEvent evt) {
                departureTimeFocusGained(evt);
            }
        });
        jPanel1.add(departureTime, new org.netbeans.lib.awtextra.AbsoluteConstraints(560, 150, 130, 40));

        javax.swing.GroupLayout layout = new javax.swing.GroupLayout(getContentPane());
        getContentPane().setLayout(layout);
        layout.setHorizontalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addComponent(jPanel1, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
        );
        layout.setVerticalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addComponent(jPanel1, javax.swing.GroupLayout.PREFERRED_SIZE, 500, javax.swing.GroupLayout.PREFERRED_SIZE)
        );

        pack();
        setLocationRelativeTo(null);
    }// </editor-fold>//GEN-END:initComponents

    private void BtnClearActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_BtnClearActionPerformed
        clearInputFields();
        if (r != null && r.isVisible()) {
            r.dispose();
        }
    }//GEN-LAST:event_BtnClearActionPerformed

    private void ExitBtnMousePressed(java.awt.event.MouseEvent evt) {//GEN-FIRST:event_ExitBtnMousePressed
        this.dispose();
        dashboard.setVisible(true);
        dashboard.getTabbedPane().setSelectedIndex(3);
        dashboard.refreshTab(5);
    }//GEN-LAST:event_ExitBtnMousePressed

    private void tablenumActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_tablenumActionPerformed
        r = new reservedTable();
        int tableNumber = tablenum.getSelectedIndex();
        
        if(tableNumber == 1){
            r.setVisible(true);
            r.selectedTable.setText("Table No. 1");
            r.seatCapPic1.setText("2");
            r.seatCapPic2.setText("2");
            r.Preview1.setIcon(new javax.swing.ImageIcon(getClass().getResource("/pictures/Table1.png")));
            r.Preview2.setIcon(new javax.swing.ImageIcon(getClass().getResource("/pictures/Table1.1.png")));
        } else if (tableNumber == 2){
            r.setVisible(true); 
            r.selectedTable.setText("Table No. 2");
            r.seatCapPic1.setText("2");
            r.seatCapPic2.setText("2");
            r.Preview1.setIcon(new javax.swing.ImageIcon(getClass().getResource("/pictures/Table3.png")));
            r.Preview2.setIcon(new javax.swing.ImageIcon(getClass().getResource("/pictures/Table3.1.png")));
        } else if (tableNumber == 3){
            r.setVisible(true);
            r.selectedTable.setText("Table No. 3");
            r.seatCapPic1.setText("4");
            r.seatCapPic2.setText("4");
            r.Preview1.setIcon(new javax.swing.ImageIcon(getClass().getResource("/pictures/Table3.png")));
            r.Preview2.setIcon(new javax.swing.ImageIcon(getClass().getResource("/pictures/Table3.1.png")));
        } else if (tableNumber == 4){
            r.setVisible(true);
            r.selectedTable.setText("Table No. 4");
            r.seatCapPic1.setText("8");
            r.seatCapPic2.setText("8");
            r.Preview1.setIcon(new javax.swing.ImageIcon(getClass().getResource("/pictures/Table4.png")));
            r.Preview2.setIcon(new javax.swing.ImageIcon(getClass().getResource("/pictures/Table4.1.png")));
        } else if (tableNumber == 5){
            r.setVisible(true);
            r.selectedTable.setText("Table No. 5");
            r.seatCapPic1.setText("2");
            r.seatCapPic2.setText("2");
            r.Preview1.setIcon(new javax.swing.ImageIcon(getClass().getResource("/pictures/Table5and6.png")));
            r.Preview2.setIcon(new javax.swing.ImageIcon(getClass().getResource("/pictures/Table5and6.1.png")));
        } else if (tableNumber == 6){
            r.setVisible(true);
            r.selectedTable.setText("Table No. 6");
            r.seatCapPic1.setText("2");
            r.seatCapPic2.setText("2");
            r.Preview1.setIcon(new javax.swing.ImageIcon(getClass().getResource("/pictures/Table5and6.png")));
            r.Preview2.setIcon(new javax.swing.ImageIcon(getClass().getResource("/pictures/Table5and6.1.png")));
        } else if (tableNumber == 7){
            r.setVisible(true);
            r.selectedTable.setText("Table No. 7");
            r.seatCapPic1.setText("6");
            r.seatCapPic2.setText("6");
            r.Preview1.setIcon(new javax.swing.ImageIcon(getClass().getResource("/pictures/Table7.png")));
            r.Preview2.setIcon(new javax.swing.ImageIcon(getClass().getResource("/pictures/Table7.1.png")));
        } else if (tableNumber == 8){
            r.setVisible(true);
            r.selectedTable.setText("Table No. 8");
            r.seatCapPic1.setText("2");
            r.seatCapPic2.setText("2");
            r.Preview1.setIcon(new javax.swing.ImageIcon(getClass().getResource("/pictures/Table8and9.png")));
            r.Preview2.setIcon(new javax.swing.ImageIcon(getClass().getResource("/pictures/Table8and9.1.png")));
        } else if (tableNumber == 9){
            r.setVisible(true);
            r.selectedTable.setText("Table No. 9");
            r.seatCapPic1.setText("2");
            r.seatCapPic2.setText("2");
            r.Preview1.setIcon(new javax.swing.ImageIcon(getClass().getResource("/pictures/Table8and9.png")));
            r.Preview2.setIcon(new javax.swing.ImageIcon(getClass().getResource("/pictures/Table8and9.1.png")));
        } else if (tableNumber == 10){
            r.setVisible(true);
            r.selectedTable.setText("Table No. 10");
            r.seatCapPic1.setText("6");
            r.seatCapPic2.setText("6");
            r.Preview1.setIcon(new javax.swing.ImageIcon(getClass().getResource("/pictures/Table10.png")));
            r.Preview2.setIcon(new javax.swing.ImageIcon(getClass().getResource("/pictures/Table10.1.png")));
        } else if (tableNumber == 11){
            r.setVisible(true);
            r.selectedTable.setText("Table No. 11");
            r.seatCapPic1.setText("2");
            r.seatCapPic2.setText("2");
            r.Preview1.setIcon(new javax.swing.ImageIcon(getClass().getResource("/pictures/Table11.png")));
            r.Preview2.setIcon(new javax.swing.ImageIcon(getClass().getResource("/pictures/Table11.1.png")));
        } else if (tableNumber == 12){
            r.setVisible(true);
            r.selectedTable.setText("Table No. 12");
            r.seatCapPic1.setText("4");
            r.seatCapPic2.setText("4");
            r.Preview1.setIcon(new javax.swing.ImageIcon(getClass().getResource("/pictures/Table12and13.png")));
            r.Preview2.setIcon(new javax.swing.ImageIcon(getClass().getResource("/pictures/Table12and13.1.png")));
        } else if (tableNumber == 13){
            r.setVisible(true);
            r.selectedTable.setText("Table No. 13");
            r.seatCapPic1.setText("4");
            r.seatCapPic2.setText("4");
            r.Preview1.setIcon(new javax.swing.ImageIcon(getClass().getResource("/pictures/Table12and13.png")));
            r.Preview2.setIcon(new javax.swing.ImageIcon(getClass().getResource("/pictures/Table12and13.1.png")));
        } else if (tableNumber == 14){
            r.setVisible(true);
            r.selectedTable.setText("Table No. 14");
            r.seatCapPic1.setText("8");
            r.seatCapPic2.setText("8");
            r.Preview1.setIcon(new javax.swing.ImageIcon(getClass().getResource("/pictures/Table14.png")));
            r.Preview2.setIcon(new javax.swing.ImageIcon(getClass().getResource("/pictures/Table14.1.png")));
        } else if (tableNumber == 15){
            r.setVisible(true);
            r.selectedTable.setText("Table No. 15");
            r.seatCapPic1.setText("4");
            r.seatCapPic2.setText("4");
            r.Preview1.setIcon(new javax.swing.ImageIcon(getClass().getResource("/pictures/Table15.png")));
            r.Preview2.setIcon(new javax.swing.ImageIcon(getClass().getResource("/pictures/Table15.1.png")));
        } else{
            r.setVisible(false);
        }
    }//GEN-LAST:event_tablenumActionPerformed

    private void BtnAddCustomerActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_BtnAddCustomerActionPerformed
        String namef = Firstname.getText().trim();
        String namel = Lastname.getText().trim();
        String timeDeparture = departureTime.getText().trim();
        String tablenumber = tablenum.getSelectedItem().toString();
        String contactnum = contactNumber.getText().trim();

        SimpleDateFormat timeFormat = new SimpleDateFormat("HH:mm");
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        timeFormat.setLenient(false);

        String dateReserve = dateFormat.format(date.getDate());
        String timeArrival = arrivalTime.getText().trim();  // This is always the current time
        
        if (tablenumber.equals("Pick a table")) {
            JOptionPane.showMessageDialog(this, "Please select a valid table.", "Invalid Table", JOptionPane.WARNING_MESSAGE);
            return; // Exit the method if no valid table is selected
        }
        if (namef.isEmpty() || namel.isEmpty() || contactnum.isEmpty() || timeDeparture.isEmpty() || tablenumber.isEmpty()) {
            JOptionPane.showMessageDialog(this, "All fields are required.", "Empty Fields", JOptionPane.WARNING_MESSAGE);
            return;
        }
        try {
            Date parsedArrivalTime = timeFormat.parse(timeArrival);  
            Date parsedDepartureTime = timeFormat.parse(timeDeparture);

            Date openingTime = timeFormat.parse("11:00");
            Date closingTime = timeFormat.parse("21:00");

            if (parsedArrivalTime.before(openingTime)) {
                JOptionPane.showMessageDialog(this, "Arrival time must be 11:00 AM or later.", "Invalid Time", JOptionPane.WARNING_MESSAGE);
                return;
            }
            if (parsedDepartureTime.after(closingTime)) {
                JOptionPane.showMessageDialog(this, "Departure time must be 9:00 PM or earlier.", "Invalid Time", JOptionPane.WARNING_MESSAGE);
                return;
            }
            if (parsedDepartureTime.before(parsedArrivalTime)) {
                JOptionPane.showMessageDialog(this, "Departure time must be later than arrival time.", "Invalid Time", JOptionPane.WARNING_MESSAGE);
                return;
            }
         
            boolean available = isTableAvailable(dateReserve, tablenumber, timeArrival, timeDeparture);
                if (!available) {
                    JOptionPane.showMessageDialog(this, "The selected table is not available. Customer Added to Waitlist", "Table Unavailable", JOptionPane.WARNING_MESSAGE);
                        // Insert into the waitlist table
                    String addToWaitlistQuery = "INSERT INTO `customer_reservation` (Date, `Arrival Time`, `Departure Time`, `Firstname`, `Lastname`, `Table Number`, `Contact Number`, `Status`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
                    pst = con.prepareStatement(addToWaitlistQuery);
                    pst.setString(1, dateReserve);
                    pst.setString(2, timeArrival);
                    pst.setString(3, timeDeparture); 
                    pst.setString(4, namef);
                    pst.setString(5, namel);
                    pst.setString(6, tablenumber);
                    pst.setString(7, contactnum);
                    pst.setString(8, "Waiting");
                     
                    pst.executeUpdate();

                    this.dispose();
                    clearInputFields();
                    dashboard.setVisible(true);
                    dashboard.updateWaitlistTable();
                    dashboard.getTabbedPane().setSelectedIndex(3);  // Switch to waitlist tab
                    dashboard.refreshTab(5);
                } else {
                    // If available, proceed to add the customer to the ongoing reservation
                    String addToOngoingQuery = "INSERT INTO `customer_reservation` (`Date`, `Arrival Time`, `Departure Time`, `Firstname`, `Lastname`, `Table Number`, `Contact Number`, `Status`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
                    pst = con.prepareStatement(addToOngoingQuery);
                    pst.setString(1, dateReserve);  
                    pst.setString(2, timeArrival);  
                    pst.setString(3, timeDeparture);  
                    pst.setString(4, namef);  
                    pst.setString(5, namel);  
                    pst.setString(6, tablenumber);  
                    pst.setString(7, contactnum);  
                    pst.setString(8, "Arrived");
                    pst.executeUpdate();

                    JOptionPane.showMessageDialog(this, "Customer added to ongoing table.");
                    this.dispose();
                    clearInputFields(); 
                    dashboard.setVisible(true);
                    dashboard.updateOngoingTable();
                    dashboard.getTabbedPane().setSelectedIndex(4);
                    dashboard.refreshTab(5);
                }
        } catch (ParseException ex) {
            JOptionPane.showMessageDialog(this, "Invalid time format. Please use HH:mm.", "Error", JOptionPane.ERROR_MESSAGE);
        } catch (SQLException ex) {
            JOptionPane.showMessageDialog(this, "Database error: " + ex.getMessage(), "Error", JOptionPane.ERROR_MESSAGE);
        }
    }//GEN-LAST:event_BtnAddCustomerActionPerformed

    private void departureTimeFocusGained(java.awt.event.FocusEvent evt) {//GEN-FIRST:event_departureTimeFocusGained
        if (!departureTimeMessageShown) {
                JOptionPane.showMessageDialog(null, 
                    "Please enter the time in military format (HH:mm). Example: 14:30 (24-hour format)", 
                    "Military Time Format", 
                    JOptionPane.INFORMATION_MESSAGE);
                    departureTimeMessageShown = true;  // Set flag to true after showing the message
        }
    }//GEN-LAST:event_departureTimeFocusGained
    public static void main(String args[]) {
        java.awt.EventQueue.invokeLater(new Runnable() {
            @Override
            public void run() {
                new WaitListCustomer(new Dashboard()).setVisible(true);
            }
        });
    }
    // Variables declaration - do not modify//GEN-BEGIN:variables
    private javax.swing.JButton BtnAddCustomer;
    private javax.swing.JButton BtnClear;
    private javax.swing.JLabel ExitBtn;
    private javax.swing.JTextField Firstname;
    private javax.swing.JTextField Lastname;
    private javax.swing.JFormattedTextField arrivalTime;
    private javax.swing.JTextField contactNumber;
    private com.toedter.calendar.JDateChooser date;
    private javax.swing.JFormattedTextField departureTime;
    private javax.swing.JLabel jLabel1;
    private javax.swing.JLabel jLabel10;
    private javax.swing.JLabel jLabel12;
    private javax.swing.JLabel jLabel13;
    private javax.swing.JLabel jLabel14;
    private javax.swing.JLabel jLabel15;
    private javax.swing.JLabel jLabel16;
    private javax.swing.JLabel jLabel17;
    private javax.swing.JLabel jLabel18;
    private javax.swing.JLabel jLabel2;
    private javax.swing.JLabel jLabel3;
    private javax.swing.JPanel jPanel1;
    private javax.swing.JPanel jPanel2;
    private javax.swing.JSeparator jSeparator1;
    private javax.swing.JSeparator jSeparator2;
    private javax.swing.JSeparator jSeparator3;
    private javax.swing.JComboBox<String> tablenum;
    // End of variables declaration//GEN-END:variables
}