package servos;

import java.awt.Color;
import java.awt.Toolkit;
import java.sql.Connection;
import java.text.SimpleDateFormat;
import java.util.Date;
import javax.swing.JOptionPane;
import javax.swing.RowFilter;
import javax.swing.Timer;
import javax.swing.table.DefaultTableModel;
import javax.swing.table.TableRowSorter;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.time.LocalDate;
import java.time.LocalTime;
import java.sql.SQLException;
import javax.swing.DefaultCellEditor;
import javax.swing.JComboBox;
import javax.swing.JTable;
import java.text.ParseException;

public class Dashboard extends javax.swing.JFrame {
    
    Color DefaultColor, ClickedColor, DefaultFontColor, ClickedFontColor;
    private Connection con = null;
    private Timer timer;
    private CustomerHistory customerHistory;
    DefaultTableModel model = null;
    
    public Dashboard(String firstName, String lastName, String uname, String pword) {
        setIconImage();
        initComponents();
        startRealTimeUpdates();
        con = DatabaseConnection.getConnection();
        if (con == null) {
        JOptionPane.showMessageDialog(this, "Failed to connect to the database.", "Database Error", JOptionPane.ERROR_MESSAGE);
        }
        
        DefaultColor = new Color(95,54,29);
        ClickedColor = new Color(255,255,255);
        DefaultFontColor = new Color(250,207,16);
        ClickedFontColor = new Color(0,0,0);
        
        Dashboard.setForeground(ClickedFontColor);
        Tables.setForeground(DefaultFontColor);
        Reservation.setForeground(DefaultFontColor);
        User.setForeground(DefaultFontColor);
        signOut2.setForeground(DefaultFontColor);
        Waitlist.setForeground(DefaultFontColor);
        Ongoing.setForeground(DefaultFontColor);
        
        DashboardPanel.setBackground(ClickedColor);
        TablesPanel.setBackground(DefaultColor);
        ReservationPanel.setBackground(DefaultColor);
        UserPanel.setBackground(DefaultColor);
        SignoutPanel.setBackground(DefaultColor);
        WaitlistPanel.setBackground(DefaultColor);
        OngoingPanel.setBackground(DefaultColor);
        
        if (firstName != null) {
            userName.setText(firstName + "!");
            userName2.setText(firstName);
            FName.setText(firstName);
            LName.setText(lastName);
            UName.setText(uname); 
            passWord.setText(pword);
        }
        loadUserPanel();
    }
    private void setIconImage() {
        setIconImage(Toolkit.getDefaultToolkit().getImage(getClass().getResource("/ICON/logo1.png")));
    }
    private void loadUserPanel() {
        FName.getText();
        LName.setText(LName.getText());
        UName.setText(UName.getText());
        passWord.setText(passWord.getText());
        dt();
        Role.setText("System Administrator");
    }
    public void refreshTab(int index) {
        updateTabContent(index); 
        tabbedPane.getComponentAt(index).revalidate();
        tabbedPane.getComponentAt(index).repaint();
    }
    private void updateTabContent(int index) {
        if (index == 5) {
            loadUserPanel(); 
        }
    }
    public void dt(){
        timer = new Timer(1000, e -> {
            Date d = new Date();
            SimpleDateFormat dateTimeNow = new SimpleDateFormat("yyyy-MMM-dd HH:mm:ss");
            String dt = dateTimeNow.format(d);
            dateLabel.setText(dt);
        });
        timer.start();
    }
    private void startRealTimeUpdates() {
        timer = new Timer(2000, e -> {
            updateReservationStatus();
            refreshTables();
        });
        timer.start();
    }
    public void search(String names) {
        model = (DefaultTableModel) ReservationTable.getModel();
        TableRowSorter<DefaultTableModel> trs = new TableRowSorter<>(model);
        ReservationTable.setRowSorter(trs);
        trs.setRowFilter(RowFilter.regexFilter("(?i)" + names, 1, 2)); 
    }
    public void searchWalkin(String names) {
        model = (DefaultTableModel) WaitlistTable.getModel();
        TableRowSorter<DefaultTableModel> trs = new TableRowSorter<>(model);
        WaitlistTable.setRowSorter(trs);
        trs.setRowFilter(RowFilter.regexFilter("(?i)" + names, 1, 2)); 
    }
    private void updateReservationStatus() {
        try {
            LocalDate today = LocalDate.now();
            LocalTime now = LocalTime.now();     
            
            updateStatusQuery("UPDATE `customer_reservation` SET `Status` = 'Completed' WHERE `Date` = ? AND `Departure Time` <= ? AND `Status` = 'Arrived'", today, now);
           
            String updateWaitlistQuery = "UPDATE `customer_reservation` SET `Status` = 'Arrived' WHERE `Status` = 'Waiting' AND `Date` = ? AND `Departure Time` <= ?";
            PreparedStatement updateWaitlistStmt = con.prepareStatement(updateWaitlistQuery);
            updateWaitlistStmt.setString(1, today.toString()); // Use today's date
            updateWaitlistStmt.setString(2, now.toString()); // Use current time

            updateWaitlistStmt.executeUpdate();
            
            String backupCancelledQuery = "INSERT INTO `backup`(`Id`, `Date`, `Arrival Time`, `Departure Time`, `Firstname`, `Lastname`, `Table Number`, `Contact Number`, `Status`)"
                                     + "SELECT * FROM customer_reservation WHERE Status = 'Cancelled'";
            PreparedStatement backupCancelledStmt = con.prepareStatement(backupCancelledQuery);
            backupCancelledStmt.executeUpdate();
            
            String deleteCancelledQuery = "DELETE FROM `customer_reservation` WHERE `Status` = 'Cancelled'";
            PreparedStatement deleteCancelledStmt = con.prepareStatement(deleteCancelledQuery);
            deleteCancelledStmt.executeUpdate();
            
        } catch (SQLException ex) {
            JOptionPane.showMessageDialog(this, "Error updating reservation statuses: " + ex.getMessage(),
                "Error", JOptionPane.ERROR_MESSAGE);
        }
    }
    private void updateStatusQuery(String query, LocalDate date, LocalTime time) throws SQLException {
        
        PreparedStatement pst = con.prepareStatement(query);
        pst.setDate(1, java.sql.Date.valueOf(date));
        pst.setTime(2, java.sql.Time.valueOf(time));
        pst.executeUpdate();
    }
    public void refreshTables() {
        updateReservationTable();
        updateOngoingTable();
        updateWaitlistTable();
        if (customerHistory != null) {
            customerHistory.updateCustomerHistoryTable();  // Update history if it's used
        }
    }
    public void updateOngoingTable() {
        updateTable("SELECT * FROM customer_reservation WHERE `Status` = 'Arrived'", OngoingTable);
        
    }
    public void updateStatus(String reservationId, String newStatus) {
        try {
            String query = "UPDATE customer_reservation SET `Status` = ? WHERE `Id` = ?";
            PreparedStatement pst = con.prepareStatement(query);
            pst.setString(1, newStatus);
            pst.setString(2, reservationId);
            pst.executeUpdate();
        } catch (SQLException ex) {
            JOptionPane.showMessageDialog(this, "Error updating status: " + ex.getMessage(),
                "Error", JOptionPane.ERROR_MESSAGE);
        }
    }
    public javax.swing.JTabbedPane getTabbedPane(){
        return tabbedPane;
    }
    public void updateWaitlistTable() {
        updateTable("SELECT * FROM customer_reservation WHERE `Status` = 'Waiting'", WaitlistTable);
    }
    private void updateTable(String query, JTable table) {
        try (PreparedStatement pst = con.prepareStatement(query);
             ResultSet rs = pst.executeQuery()) {

            model = (DefaultTableModel) table.getModel();
            model.setRowCount(0); 

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

            int statusColumnIndex = 8;  // Index for Status column
            if (table.getColumnModel().getColumnCount() > statusColumnIndex) {
                JComboBox<String> statusComboBox = new JComboBox<>(new String[]{"Pending", "Waiting", "Arrived", "Cancelled"});
                table.getColumnModel().getColumn(statusColumnIndex).setCellEditor(new DefaultCellEditor(statusComboBox));
                    
                statusComboBox.addActionListener(e -> {
                    int selectedRow = table.getSelectedRow();
                    if (selectedRow == -1) {
                        JOptionPane.showMessageDialog(null,
                            "No row is selected.",
                            "Error", JOptionPane.ERROR_MESSAGE);
                        return;
                    }
                    
                    String reservationId = table.getValueAt(selectedRow, 0).toString();
                    String newStatus = statusComboBox.getSelectedItem().toString();
                    String reservationDate = table.getValueAt(selectedRow, 3).toString(); // Reservation date (yyyy-MM-dd)
                    String arrivalTime = table.getValueAt(selectedRow, 4).toString(); // Arrival time (HH:mm)

                    LocalDate currentDate = LocalDate.now(); // Current date (yyyy-MM-dd)
                    LocalTime currentTime = LocalTime.now(); // Current time (HH:mm)
                  
                    if (table == WaitlistTable) {
                        try {
                            String ongoingQuery = "SELECT `Departure Time` FROM customer_reservation WHERE `Status` = 'Arrived' ORDER BY `Departure Time` DESC LIMIT 1";
                            try (PreparedStatement ongoingPst = con.prepareStatement(ongoingQuery);
                                ResultSet ongoingRs = ongoingPst.executeQuery()) {

                                if (ongoingRs.next()) {
                                    String departureTime = ongoingRs.getString("Departure Time");
                                    Date currentDateForDep = new Date();
                                    SimpleDateFormat fullDateFormat = new SimpleDateFormat("yyyy-MM-dd");

                                    if (departureTime.length() == 8) { // If "HH:mm:ss", prepend current date
                                        String todayDateForDep = fullDateFormat.format(currentDateForDep);
                                        departureTime = todayDateForDep + " " + departureTime;
                                    }

                                    SimpleDateFormat dateTimeFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                                    Date depTime = dateTimeFormat.parse(departureTime);

                                    if (currentDateForDep.before(depTime)) {
                                        JOptionPane.showMessageDialog(null,
                                            "You cannot change the status for waiting customers until the ongoing reservation finishes.",
                                            "Error", JOptionPane.ERROR_MESSAGE);
                                        return;
                                    }
                                }
                            }
                        } catch (SQLException | ParseException ex) {
                            JOptionPane.showMessageDialog(null,
                                "Error checking ongoing reservation: " + ex.getMessage(),
                                "Error", JOptionPane.ERROR_MESSAGE);
                        }
                    }
                        try {
                            LocalDate reservationLocalDate = LocalDate.parse(reservationDate);
                            LocalTime reservationArrivalTime = LocalTime.parse(arrivalTime);

                            if ("Cancelled".equals(newStatus)) {
                                int confirmation = JOptionPane.showConfirmDialog(null,
                                "Are you sure you want to cancel this reservation?",
                                "Confirm Cancellation", JOptionPane.YES_NO_OPTION);
                                if (confirmation == JOptionPane.YES_OPTION) {
                                    updateStatus(reservationId, newStatus);
                                    updateTable(query, table);
                                }
                            } else if (!reservationLocalDate.equals(currentDate)) {
                                JOptionPane.showMessageDialog(null,
                                "Status changes are only allowed for today's reservations, except cancellations.",
                                "Error", JOptionPane.ERROR_MESSAGE);
                            } else if ("Arrived".equals(newStatus) && currentTime.isBefore(reservationArrivalTime)) {
                                JOptionPane.showMessageDialog(null,
                                "You cannot change the status as the reservation's arrival time has not passed yet.",
                                "Error", JOptionPane.ERROR_MESSAGE);
                            } else {
                                updateStatus(reservationId, newStatus);
                                updateTable(query, table);
                            }
                        } catch (Exception ex) {
                            JOptionPane.showMessageDialog(null,
                            "Error parsing date/time: " + ex.getMessage(),
                            "Error", JOptionPane.ERROR_MESSAGE);
                        }
                });
            }
                        
        } catch (SQLException ex) {
            JOptionPane.showMessageDialog(null,
                "Error updating table: " + ex.getMessage(),
                "Error", JOptionPane.ERROR_MESSAGE);
        }
    }
    public void updateReservationTable() {
        updateTable("SELECT * FROM customer_reservation WHERE Status = 'Pending'", ReservationTable);
    }
    private void handleTableAction(String tableNumber) {
        PreparedStatement pst = null;
        ResultSet rs = null;

        try {
            con = DatabaseConnection.getConnection();
            String query = "SELECT `Firstname`, `Lastname`, `Arrival Time`, `Departure Time` FROM `customer_reservation` WHERE `Table Number` = ? AND `Status` = 'Arrived'";

            pst = con.prepareStatement(query); // Prepare the statement and set the table number
            pst.setString(1, tableNumber);
            rs = pst.executeQuery();

            if (rs.next()) {
                String firstName = rs.getString("Firstname");
                String lastName = rs.getString("Lastname");
                String arrivalTime = rs.getString("Arrival Time");
                String departureTime = rs.getString("Departure Time");

                TableFrame tableFrame = new TableFrame(this, tableNumber);
                tableFrame.setReservationDetails(firstName, lastName, arrivalTime, departureTime);
                tableFrame.setVisible(true);
            } else {
                AvailableTable availableTable = new AvailableTable(this, tableNumber);
                availableTable.setVisible(true);
            }
        } catch (SQLException ex) {
            JOptionPane.showMessageDialog(this, "Error fetching table details: " + ex.getMessage(), "Database Error", JOptionPane.ERROR_MESSAGE);
        }
    }
    public Dashboard(){
        initComponents();
    }
    @SuppressWarnings("unchecked")
    // <editor-fold defaultstate="collapsed" desc="Generated Code">//GEN-BEGIN:initComponents
    private void initComponents() {

        jPanel1 = new javax.swing.JPanel();
        jPanel3 = new javax.swing.JPanel();
        DashboardPanel = new javax.swing.JPanel();
        DashboardIcon = new javax.swing.JLabel();
        Dashboard = new javax.swing.JLabel();
        TablesPanel = new javax.swing.JPanel();
        Tables = new javax.swing.JLabel();
        TableIcon = new javax.swing.JLabel();
        ReservationPanel = new javax.swing.JPanel();
        ReserveIcon = new javax.swing.JLabel();
        Reservation = new javax.swing.JLabel();
        UserPanel = new javax.swing.JPanel();
        jLabel3 = new javax.swing.JLabel();
        User = new javax.swing.JLabel();
        SignoutPanel = new javax.swing.JPanel();
        signOut2 = new javax.swing.JLabel();
        jLabel4 = new javax.swing.JLabel();
        jLabel9 = new javax.swing.JLabel();
        jLabel10 = new javax.swing.JLabel();
        jLabel12 = new javax.swing.JLabel();
        jSeparator1 = new javax.swing.JSeparator();
        WaitlistPanel = new javax.swing.JPanel();
        Waitlist = new javax.swing.JLabel();
        WaitlistIcon = new javax.swing.JLabel();
        OngoingPanel = new javax.swing.JPanel();
        Ongoing = new javax.swing.JLabel();
        jLabel13 = new javax.swing.JLabel();
        jPanel2 = new javax.swing.JPanel();
        MenuName = new javax.swing.JLabel();
        jLabel2 = new javax.swing.JLabel();
        signOut = new javax.swing.JLabel();
        tabbedPane = new javax.swing.JTabbedPane();
        jPanel4 = new javax.swing.JPanel();
        jLabel6 = new javax.swing.JLabel();
        jPanel5 = new javax.swing.JPanel();
        Table15 = new javax.swing.JButton();
        Table14 = new javax.swing.JButton();
        Table13 = new javax.swing.JButton();
        Table12 = new javax.swing.JButton();
        Table11 = new javax.swing.JButton();
        Table10 = new javax.swing.JButton();
        Table9 = new javax.swing.JButton();
        Table8 = new javax.swing.JButton();
        Table7 = new javax.swing.JButton();
        Table1 = new javax.swing.JButton();
        Table2 = new javax.swing.JButton();
        Table6 = new javax.swing.JButton();
        Table5 = new javax.swing.JButton();
        Table4 = new javax.swing.JButton();
        Table3 = new javax.swing.JButton();
        jLabel18 = new javax.swing.JLabel();
        jLabel20 = new javax.swing.JLabel();
        jLabel21 = new javax.swing.JLabel();
        jLabel28 = new javax.swing.JLabel();
        jLabel34 = new javax.swing.JLabel();
        jLabel35 = new javax.swing.JLabel();
        jLabel36 = new javax.swing.JLabel();
        jLabel37 = new javax.swing.JLabel();
        jLabel38 = new javax.swing.JLabel();
        jLabel39 = new javax.swing.JLabel();
        jLabel42 = new javax.swing.JLabel();
        jLabel43 = new javax.swing.JLabel();
        jLabel44 = new javax.swing.JLabel();
        jLabel45 = new javax.swing.JLabel();
        jLabel46 = new javax.swing.JLabel();
        jLabel47 = new javax.swing.JLabel();
        jLabel48 = new javax.swing.JLabel();
        jPanel6 = new javax.swing.JPanel();
        BtnDelete = new javax.swing.JButton();
        jScrollPane1 = new javax.swing.JScrollPane();
        ReservationTable = new javax.swing.JTable();
        jLabel1 = new javax.swing.JLabel();
        BackUp = new javax.swing.JLabel();
        jLabel19 = new javax.swing.JLabel();
        jLabel22 = new javax.swing.JLabel();
        SearchBtn = new javax.swing.JLabel();
        SearchField = new javax.swing.JTextField();
        jPanel18 = new javax.swing.JPanel();
        AddCustomer = new javax.swing.JButton();
        jScrollPane2 = new javax.swing.JScrollPane();
        WaitlistTable = new javax.swing.JTable();
        jLabel5 = new javax.swing.JLabel();
        jLabel14 = new javax.swing.JLabel();
        jLabel15 = new javax.swing.JLabel();
        search = new javax.swing.JLabel();
        walkinsearch = new javax.swing.JTextField();
        jPanel8 = new javax.swing.JPanel();
        jLabel8 = new javax.swing.JLabel();
        jScrollPane3 = new javax.swing.JScrollPane();
        OngoingTable = new javax.swing.JTable();
        history = new javax.swing.JLabel();
        jLabel16 = new javax.swing.JLabel();
        jLabel17 = new javax.swing.JLabel();
        jPanel7 = new javax.swing.JPanel();
        jPanel10 = new javax.swing.JPanel();
        jLabel11 = new javax.swing.JLabel();
        jLabel7 = new javax.swing.JLabel();
        jLabel29 = new javax.swing.JLabel();
        jLabel30 = new javax.swing.JLabel();
        jLabel31 = new javax.swing.JLabel();
        jLabel32 = new javax.swing.JLabel();
        jLabel33 = new javax.swing.JLabel();
        jPanel13 = new javax.swing.JPanel();
        FName = new javax.swing.JLabel();
        jPanel17 = new javax.swing.JPanel();
        LName = new javax.swing.JLabel();
        jLabel40 = new javax.swing.JLabel();
        jPanel20 = new javax.swing.JPanel();
        Role = new javax.swing.JLabel();
        jPanel19 = new javax.swing.JPanel();
        UName = new javax.swing.JLabel();
        jPanel21 = new javax.swing.JPanel();
        dateLabel = new javax.swing.JLabel();
        jLabel49 = new javax.swing.JLabel();
        jPanel22 = new javax.swing.JPanel();
        passWord = new javax.swing.JLabel();

        setDefaultCloseOperation(javax.swing.WindowConstants.EXIT_ON_CLOSE);
        setUndecorated(true);
        setResizable(false);
        getContentPane().setLayout(new org.netbeans.lib.awtextra.AbsoluteLayout());

        jPanel1.setBackground(new java.awt.Color(255, 255, 255));
        jPanel1.setPreferredSize(new java.awt.Dimension(1920, 1080));
        jPanel1.setLayout(new org.netbeans.lib.awtextra.AbsoluteLayout());

        jPanel3.setBackground(new java.awt.Color(95, 54, 29));
        jPanel3.setLayout(new org.netbeans.lib.awtextra.AbsoluteLayout());

        DashboardPanel.setBackground(new java.awt.Color(95, 54, 29));
        DashboardPanel.addMouseListener(new java.awt.event.MouseAdapter() {
            public void mousePressed(java.awt.event.MouseEvent evt) {
                DashboardPanelMousePressed(evt);
            }
        });

        DashboardIcon.setBackground(new java.awt.Color(255, 255, 255));
        DashboardIcon.setIcon(new javax.swing.ImageIcon(getClass().getResource("/ICON/dashboard.png"))); // NOI18N

        Dashboard.setBackground(new java.awt.Color(250, 207, 16));
        Dashboard.setFont(new java.awt.Font("Franklin Gothic Book", 0, 22)); // NOI18N
        Dashboard.setForeground(new java.awt.Color(250, 207, 16));
        Dashboard.setText("Dashboard");
        Dashboard.setVerticalAlignment(javax.swing.SwingConstants.TOP);
        Dashboard.setHorizontalTextPosition(javax.swing.SwingConstants.CENTER);

        javax.swing.GroupLayout DashboardPanelLayout = new javax.swing.GroupLayout(DashboardPanel);
        DashboardPanel.setLayout(DashboardPanelLayout);
        DashboardPanelLayout.setHorizontalGroup(
            DashboardPanelLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(DashboardPanelLayout.createSequentialGroup()
                .addGap(22, 22, 22)
                .addComponent(DashboardIcon)
                .addGap(18, 18, 18)
                .addComponent(Dashboard, javax.swing.GroupLayout.PREFERRED_SIZE, 172, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addContainerGap(34, Short.MAX_VALUE))
        );
        DashboardPanelLayout.setVerticalGroup(
            DashboardPanelLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(DashboardPanelLayout.createSequentialGroup()
                .addComponent(DashboardIcon, javax.swing.GroupLayout.PREFERRED_SIZE, 58, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(0, 0, Short.MAX_VALUE))
            .addGroup(DashboardPanelLayout.createSequentialGroup()
                .addGap(16, 16, 16)
                .addComponent(Dashboard)
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
        );

        jPanel3.add(DashboardPanel, new org.netbeans.lib.awtextra.AbsoluteConstraints(0, 230, 270, -1));

        TablesPanel.setBackground(new java.awt.Color(95, 54, 29));
        TablesPanel.setPreferredSize(new java.awt.Dimension(270, 58));
        TablesPanel.addMouseListener(new java.awt.event.MouseAdapter() {
            public void mousePressed(java.awt.event.MouseEvent evt) {
                TablesPanelMousePressed(evt);
            }
        });

        Tables.setFont(new java.awt.Font("Franklin Gothic Book", 0, 22)); // NOI18N
        Tables.setForeground(new java.awt.Color(250, 207, 16));
        Tables.setText("Tables");
        Tables.setVerticalAlignment(javax.swing.SwingConstants.TOP);
        Tables.setHorizontalTextPosition(javax.swing.SwingConstants.CENTER);

        TableIcon.setIcon(new javax.swing.ImageIcon(getClass().getResource("/ICON/table.png"))); // NOI18N

        javax.swing.GroupLayout TablesPanelLayout = new javax.swing.GroupLayout(TablesPanel);
        TablesPanel.setLayout(TablesPanelLayout);
        TablesPanelLayout.setHorizontalGroup(
            TablesPanelLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(TablesPanelLayout.createSequentialGroup()
                .addGap(22, 22, 22)
                .addComponent(TableIcon, javax.swing.GroupLayout.PREFERRED_SIZE, 37, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(Tables, javax.swing.GroupLayout.DEFAULT_SIZE, 172, Short.MAX_VALUE)
                .addGap(33, 33, 33))
        );
        TablesPanelLayout.setVerticalGroup(
            TablesPanelLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, TablesPanelLayout.createSequentialGroup()
                .addContainerGap(16, Short.MAX_VALUE)
                .addGroup(TablesPanelLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(Tables, javax.swing.GroupLayout.PREFERRED_SIZE, 38, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(TableIcon))
                .addContainerGap())
        );

        jPanel3.add(TablesPanel, new org.netbeans.lib.awtextra.AbsoluteConstraints(0, 300, 270, 60));

        ReservationPanel.setBackground(new java.awt.Color(95, 54, 29));
        ReservationPanel.setPreferredSize(new java.awt.Dimension(270, 58));
        ReservationPanel.addMouseListener(new java.awt.event.MouseAdapter() {
            public void mousePressed(java.awt.event.MouseEvent evt) {
                ReservationPanelMousePressed(evt);
            }
        });

        ReserveIcon.setIcon(new javax.swing.ImageIcon(getClass().getResource("/ICON/list.png"))); // NOI18N

        Reservation.setBackground(new java.awt.Color(250, 207, 16));
        Reservation.setFont(new java.awt.Font("Franklin Gothic Book", 0, 22)); // NOI18N
        Reservation.setForeground(new java.awt.Color(250, 207, 16));
        Reservation.setText("Reservation");
        Reservation.setVerticalAlignment(javax.swing.SwingConstants.TOP);
        Reservation.setHorizontalTextPosition(javax.swing.SwingConstants.CENTER);

        javax.swing.GroupLayout ReservationPanelLayout = new javax.swing.GroupLayout(ReservationPanel);
        ReservationPanel.setLayout(ReservationPanelLayout);
        ReservationPanelLayout.setHorizontalGroup(
            ReservationPanelLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(ReservationPanelLayout.createSequentialGroup()
                .addGap(22, 22, 22)
                .addComponent(ReserveIcon)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addComponent(Reservation)
                .addContainerGap(89, Short.MAX_VALUE))
        );
        ReservationPanelLayout.setVerticalGroup(
            ReservationPanelLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(ReservationPanelLayout.createSequentialGroup()
                .addGroup(ReservationPanelLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(ReservationPanelLayout.createSequentialGroup()
                        .addContainerGap()
                        .addComponent(ReserveIcon, javax.swing.GroupLayout.PREFERRED_SIZE, 44, javax.swing.GroupLayout.PREFERRED_SIZE))
                    .addGroup(ReservationPanelLayout.createSequentialGroup()
                        .addGap(15, 15, 15)
                        .addComponent(Reservation)))
                .addContainerGap(8, Short.MAX_VALUE))
        );

        jPanel3.add(ReservationPanel, new org.netbeans.lib.awtextra.AbsoluteConstraints(0, 370, -1, -1));

        UserPanel.setBackground(new java.awt.Color(95, 54, 29));
        UserPanel.addMouseListener(new java.awt.event.MouseAdapter() {
            public void mousePressed(java.awt.event.MouseEvent evt) {
                UserPanelMousePressed(evt);
            }
        });

        jLabel3.setIcon(new javax.swing.ImageIcon(getClass().getResource("/ICON/user.png"))); // NOI18N

        User.setBackground(new java.awt.Color(250, 207, 16));
        User.setFont(new java.awt.Font("Franklin Gothic Book", 0, 22)); // NOI18N
        User.setForeground(new java.awt.Color(250, 207, 16));
        User.setText("User");
        User.setVerticalAlignment(javax.swing.SwingConstants.TOP);
        User.setHorizontalTextPosition(javax.swing.SwingConstants.CENTER);

        javax.swing.GroupLayout UserPanelLayout = new javax.swing.GroupLayout(UserPanel);
        UserPanel.setLayout(UserPanelLayout);
        UserPanelLayout.setHorizontalGroup(
            UserPanelLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(UserPanelLayout.createSequentialGroup()
                .addGap(20, 20, 20)
                .addComponent(jLabel3)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addComponent(User, javax.swing.GroupLayout.PREFERRED_SIZE, 172, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addContainerGap(26, Short.MAX_VALUE))
        );
        UserPanelLayout.setVerticalGroup(
            UserPanelLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(UserPanelLayout.createSequentialGroup()
                .addContainerGap()
                .addComponent(jLabel3)
                .addContainerGap(14, Short.MAX_VALUE))
            .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, UserPanelLayout.createSequentialGroup()
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                .addComponent(User)
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
        );

        jLabel3.getAccessibleContext().setAccessibleName("");
        jLabel3.getAccessibleContext().setAccessibleParent(UserPanel);
        User.getAccessibleContext().setAccessibleParent(UserPanel);

        jPanel3.add(UserPanel, new org.netbeans.lib.awtextra.AbsoluteConstraints(0, 670, 270, 60));

        SignoutPanel.setBackground(new java.awt.Color(95, 54, 29));

        signOut2.setFont(new java.awt.Font("Franklin Gothic Book", 0, 22)); // NOI18N
        signOut2.setForeground(new java.awt.Color(250, 207, 16));
        signOut2.setText("Sign out");
        signOut2.setVerticalAlignment(javax.swing.SwingConstants.TOP);
        signOut2.setHorizontalTextPosition(javax.swing.SwingConstants.CENTER);
        signOut2.addMouseListener(new java.awt.event.MouseAdapter() {
            public void mouseClicked(java.awt.event.MouseEvent evt) {
                signOut2MouseClicked(evt);
            }
        });

        jLabel4.setIcon(new javax.swing.ImageIcon(getClass().getResource("/ICON/log out.png"))); // NOI18N

        javax.swing.GroupLayout SignoutPanelLayout = new javax.swing.GroupLayout(SignoutPanel);
        SignoutPanel.setLayout(SignoutPanelLayout);
        SignoutPanelLayout.setHorizontalGroup(
            SignoutPanelLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(SignoutPanelLayout.createSequentialGroup()
                .addGap(20, 20, 20)
                .addComponent(jLabel4, javax.swing.GroupLayout.PREFERRED_SIZE, 40, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(signOut2, javax.swing.GroupLayout.PREFERRED_SIZE, 172, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addContainerGap(32, Short.MAX_VALUE))
        );
        SignoutPanelLayout.setVerticalGroup(
            SignoutPanelLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(SignoutPanelLayout.createSequentialGroup()
                .addContainerGap()
                .addGroup(SignoutPanelLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.TRAILING)
                    .addComponent(jLabel4, javax.swing.GroupLayout.PREFERRED_SIZE, 40, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(signOut2, javax.swing.GroupLayout.PREFERRED_SIZE, 35, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addContainerGap(14, Short.MAX_VALUE))
        );

        signOut2.getAccessibleContext().setAccessibleParent(SignoutPanel);
        jLabel4.getAccessibleContext().setAccessibleParent(SignoutPanel);

        jPanel3.add(SignoutPanel, new org.netbeans.lib.awtextra.AbsoluteConstraints(0, 740, 270, 60));

        jLabel9.setIcon(new javax.swing.ImageIcon(getClass().getResource("/ICON/logo1.png"))); // NOI18N
        jPanel3.add(jLabel9, new org.netbeans.lib.awtextra.AbsoluteConstraints(-10, 10, 110, 90));

        jLabel10.setFont(new java.awt.Font("Book Antiqua", 1, 26)); // NOI18N
        jLabel10.setForeground(new java.awt.Color(245, 244, 230));
        jLabel10.setText("S E R V O S");
        jPanel3.add(jLabel10, new org.netbeans.lib.awtextra.AbsoluteConstraints(110, 40, -1, -1));

        jLabel12.setFont(new java.awt.Font("Franklin Gothic Book", 1, 20)); // NOI18N
        jLabel12.setForeground(new java.awt.Color(250, 207, 16));
        jLabel12.setText(" Welcome back, ");
        jPanel3.add(jLabel12, new org.netbeans.lib.awtextra.AbsoluteConstraints(60, 140, 150, 20));

        userName.setFont(new java.awt.Font("Leelawadee UI", 1, 26)); // NOI18N
        userName.setForeground(new java.awt.Color(255, 255, 255));
        userName.setHorizontalAlignment(javax.swing.SwingConstants.CENTER);
        userName.setToolTipText("");
        jPanel3.add(userName, new org.netbeans.lib.awtextra.AbsoluteConstraints(30, 170, 210, 50));

        jSeparator1.setBackground(new java.awt.Color(255, 255, 255));
        jSeparator1.setForeground(new java.awt.Color(255, 255, 255));
        jPanel3.add(jSeparator1, new org.netbeans.lib.awtextra.AbsoluteConstraints(0, 110, 270, 10));

        WaitlistPanel.setBackground(new java.awt.Color(95, 54, 29));
        WaitlistPanel.addMouseListener(new java.awt.event.MouseAdapter() {
            public void mousePressed(java.awt.event.MouseEvent evt) {
                WaitlistPanelMousePressed(evt);
            }
        });

        Waitlist.setFont(new java.awt.Font("Franklin Gothic Book", 0, 22)); // NOI18N
        Waitlist.setForeground(new java.awt.Color(250, 207, 16));
        Waitlist.setText("Waitlist");

        WaitlistIcon.setIcon(new javax.swing.ImageIcon(getClass().getResource("/ICON/waiting.png"))); // NOI18N

        javax.swing.GroupLayout WaitlistPanelLayout = new javax.swing.GroupLayout(WaitlistPanel);
        WaitlistPanel.setLayout(WaitlistPanelLayout);
        WaitlistPanelLayout.setHorizontalGroup(
            WaitlistPanelLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(WaitlistPanelLayout.createSequentialGroup()
                .addGap(22, 22, 22)
                .addComponent(WaitlistIcon, javax.swing.GroupLayout.PREFERRED_SIZE, 31, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addComponent(Waitlist, javax.swing.GroupLayout.PREFERRED_SIZE, 93, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addContainerGap(109, Short.MAX_VALUE))
        );
        WaitlistPanelLayout.setVerticalGroup(
            WaitlistPanelLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(WaitlistPanelLayout.createSequentialGroup()
                .addGap(8, 8, 8)
                .addComponent(WaitlistIcon, javax.swing.GroupLayout.DEFAULT_SIZE, 46, Short.MAX_VALUE)
                .addContainerGap())
            .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, WaitlistPanelLayout.createSequentialGroup()
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                .addComponent(Waitlist)
                .addGap(15, 15, 15))
        );

        jPanel3.add(WaitlistPanel, new org.netbeans.lib.awtextra.AbsoluteConstraints(0, 440, 270, 60));

        OngoingPanel.setBackground(new java.awt.Color(95, 54, 29));
        OngoingPanel.addMouseListener(new java.awt.event.MouseAdapter() {
            public void mousePressed(java.awt.event.MouseEvent evt) {
                OngoingPanelMousePressed(evt);
            }
        });

        Ongoing.setFont(new java.awt.Font("Franklin Gothic Book", 0, 22)); // NOI18N
        Ongoing.setForeground(new java.awt.Color(250, 207, 16));
        Ongoing.setText("Ongoing Customer");

        jLabel13.setIcon(new javax.swing.ImageIcon(getClass().getResource("/ICON/customer-ongoing.png"))); // NOI18N

        javax.swing.GroupLayout OngoingPanelLayout = new javax.swing.GroupLayout(OngoingPanel);
        OngoingPanel.setLayout(OngoingPanelLayout);
        OngoingPanelLayout.setHorizontalGroup(
            OngoingPanelLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(OngoingPanelLayout.createSequentialGroup()
                .addGap(25, 25, 25)
                .addComponent(jLabel13, javax.swing.GroupLayout.PREFERRED_SIZE, 31, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addComponent(Ongoing)
                .addContainerGap(27, Short.MAX_VALUE))
        );
        OngoingPanelLayout.setVerticalGroup(
            OngoingPanelLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(OngoingPanelLayout.createSequentialGroup()
                .addGap(16, 16, 16)
                .addGroup(OngoingPanelLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(Ongoing)
                    .addComponent(jLabel13))
                .addContainerGap(14, Short.MAX_VALUE))
        );

        jPanel3.add(OngoingPanel, new org.netbeans.lib.awtextra.AbsoluteConstraints(0, 510, 270, 60));

        jPanel1.add(jPanel3, new org.netbeans.lib.awtextra.AbsoluteConstraints(0, 0, 270, 880));

        jPanel2.setBackground(new java.awt.Color(246, 239, 189));
        jPanel2.setLayout(new org.netbeans.lib.awtextra.AbsoluteLayout());

        MenuName.setFont(new java.awt.Font("Franklin Gothic Book", 0, 20)); // NOI18N
        MenuName.setText("Dashboard");
        jPanel2.add(MenuName, new org.netbeans.lib.awtextra.AbsoluteConstraints(30, 10, 190, 30));

        jLabel2.setIcon(new javax.swing.ImageIcon(getClass().getResource("/ICON/signoutuser.png"))); // NOI18N
        jPanel2.add(jLabel2, new org.netbeans.lib.awtextra.AbsoluteConstraints(1120, 0, 40, 50));

        signOut.setFont(new java.awt.Font("Franklin Gothic Book", 0, 20)); // NOI18N
        signOut.setText("Sign out");
        signOut.addMouseListener(new java.awt.event.MouseAdapter() {
            public void mouseClicked(java.awt.event.MouseEvent evt) {
                signOutMouseClicked(evt);
            }
        });
        jPanel2.add(signOut, new org.netbeans.lib.awtextra.AbsoluteConstraints(1180, 10, 80, 30));

        userName2.setFont(new java.awt.Font("Franklin Gothic Book", 0, 20)); // NOI18N
        userName2.setHorizontalAlignment(javax.swing.SwingConstants.RIGHT);
        jPanel2.add(userName2, new org.netbeans.lib.awtextra.AbsoluteConstraints(980, 10, 130, 30));

        jPanel1.add(jPanel2, new org.netbeans.lib.awtextra.AbsoluteConstraints(270, 0, 1270, 50));

        tabbedPane.setBackground(new java.awt.Color(204, 204, 204));
        tabbedPane.setTabLayoutPolicy(javax.swing.JTabbedPane.SCROLL_TAB_LAYOUT);

        jPanel4.setBackground(new java.awt.Color(255, 255, 255));

        jLabel6.setIcon(new javax.swing.ImageIcon(getClass().getResource("/ICON/db bg.png"))); // NOI18N

        javax.swing.GroupLayout jPanel4Layout = new javax.swing.GroupLayout(jPanel4);
        jPanel4.setLayout(jPanel4Layout);
        jPanel4Layout.setHorizontalGroup(
            jPanel4Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel4Layout.createSequentialGroup()
                .addContainerGap()
                .addComponent(jLabel6, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                .addContainerGap())
        );
        jPanel4Layout.setVerticalGroup(
            jPanel4Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel4Layout.createSequentialGroup()
                .addGap(14, 14, 14)
                .addComponent(jLabel6, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                .addContainerGap())
        );

        tabbedPane.addTab("tab1", jPanel4);

        jPanel5.setBackground(new java.awt.Color(255, 255, 255));
        jPanel5.setLayout(new org.netbeans.lib.awtextra.AbsoluteLayout());

        Table15.setBackground(new java.awt.Color(95, 54, 29));
        Table15.setFont(new java.awt.Font("Tahoma", 1, 15)); // NOI18N
        Table15.setForeground(new java.awt.Color(255, 255, 255));
        Table15.setText("Table 15");
        Table15.setFocusable(false);
        Table15.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                Table15ActionPerformed(evt);
            }
        });
        jPanel5.add(Table15, new org.netbeans.lib.awtextra.AbsoluteConstraints(910, 660, 100, 60));

        Table14.setBackground(new java.awt.Color(95, 54, 29));
        Table14.setFont(new java.awt.Font("Tahoma", 1, 15)); // NOI18N
        Table14.setForeground(new java.awt.Color(255, 255, 255));
        Table14.setText("Table 14");
        Table14.setFocusable(false);
        Table14.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                Table14ActionPerformed(evt);
            }
        });
        jPanel5.add(Table14, new org.netbeans.lib.awtextra.AbsoluteConstraints(580, 670, 100, 60));

        Table13.setBackground(new java.awt.Color(95, 54, 29));
        Table13.setFont(new java.awt.Font("Tahoma", 1, 15)); // NOI18N
        Table13.setForeground(new java.awt.Color(255, 255, 255));
        Table13.setText("Table 13");
        Table13.setFocusable(false);
        Table13.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                Table13ActionPerformed(evt);
            }
        });
        jPanel5.add(Table13, new org.netbeans.lib.awtextra.AbsoluteConstraints(260, 660, 100, 60));

        Table12.setBackground(new java.awt.Color(95, 54, 29));
        Table12.setFont(new java.awt.Font("Tahoma", 1, 12)); // NOI18N
        Table12.setForeground(new java.awt.Color(255, 255, 255));
        Table12.setText("Table 12");
        Table12.setFocusable(false);
        Table12.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                Table12ActionPerformed(evt);
            }
        });
        jPanel5.add(Table12, new org.netbeans.lib.awtextra.AbsoluteConstraints(1050, 380, 90, 60));

        Table11.setBackground(new java.awt.Color(95, 54, 29));
        Table11.setFont(new java.awt.Font("Tahoma", 1, 12)); // NOI18N
        Table11.setForeground(new java.awt.Color(255, 255, 255));
        Table11.setText("Table 11");
        Table11.setFocusable(false);
        Table11.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                Table11ActionPerformed(evt);
            }
        });
        jPanel5.add(Table11, new org.netbeans.lib.awtextra.AbsoluteConstraints(850, 390, 90, 60));

        Table10.setBackground(new java.awt.Color(95, 54, 29));
        Table10.setFont(new java.awt.Font("Tahoma", 1, 15)); // NOI18N
        Table10.setForeground(new java.awt.Color(255, 255, 255));
        Table10.setText("Table 10");
        Table10.setFocusable(false);
        Table10.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                Table10ActionPerformed(evt);
            }
        });
        jPanel5.add(Table10, new org.netbeans.lib.awtextra.AbsoluteConstraints(640, 400, 100, 60));

        Table9.setBackground(new java.awt.Color(95, 54, 29));
        Table9.setFont(new java.awt.Font("Tahoma", 1, 15)); // NOI18N
        Table9.setForeground(new java.awt.Color(255, 255, 255));
        Table9.setText("Table 9");
        Table9.setFocusable(false);
        Table9.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                Table9ActionPerformed(evt);
            }
        });
        jPanel5.add(Table9, new org.netbeans.lib.awtextra.AbsoluteConstraints(450, 400, 90, 60));

        Table8.setBackground(new java.awt.Color(95, 54, 29));
        Table8.setFont(new java.awt.Font("Tahoma", 1, 15)); // NOI18N
        Table8.setForeground(new java.awt.Color(255, 255, 255));
        Table8.setText("Table 8");
        Table8.setFocusable(false);
        Table8.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                Table8ActionPerformed(evt);
            }
        });
        jPanel5.add(Table8, new org.netbeans.lib.awtextra.AbsoluteConstraints(310, 400, 90, 60));

        Table7.setBackground(new java.awt.Color(95, 54, 29));
        Table7.setFont(new java.awt.Font("Tahoma", 1, 15)); // NOI18N
        Table7.setForeground(new java.awt.Color(255, 255, 255));
        Table7.setText("Table 7");
        Table7.setFocusable(false);
        Table7.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                Table7ActionPerformed(evt);
            }
        });
        jPanel5.add(Table7, new org.netbeans.lib.awtextra.AbsoluteConstraints(110, 390, 90, 60));

        Table1.setBackground(new java.awt.Color(95, 54, 29));
        Table1.setFont(new java.awt.Font("Tahoma", 1, 15)); // NOI18N
        Table1.setForeground(new java.awt.Color(255, 255, 255));
        Table1.setText("Table 1");
        Table1.setFocusable(false);
        Table1.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                Table1ActionPerformed(evt);
            }
        });
        jPanel5.add(Table1, new org.netbeans.lib.awtextra.AbsoluteConstraints(60, 130, 90, 60));

        Table2.setBackground(new java.awt.Color(95, 54, 29));
        Table2.setFont(new java.awt.Font("Tahoma", 1, 15)); // NOI18N
        Table2.setForeground(new java.awt.Color(255, 255, 255));
        Table2.setText("Table 2");
        Table2.setFocusable(false);
        Table2.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                Table2ActionPerformed(evt);
            }
        });
        jPanel5.add(Table2, new org.netbeans.lib.awtextra.AbsoluteConstraints(190, 130, 90, 60));

        Table6.setBackground(new java.awt.Color(95, 54, 29));
        Table6.setFont(new java.awt.Font("Tahoma", 1, 15)); // NOI18N
        Table6.setForeground(new java.awt.Color(255, 255, 255));
        Table6.setText("Table 6");
        Table6.setFocusable(false);
        Table6.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                Table6ActionPerformed(evt);
            }
        });
        jPanel5.add(Table6, new org.netbeans.lib.awtextra.AbsoluteConstraints(1110, 140, 90, 60));

        Table5.setBackground(new java.awt.Color(95, 54, 29));
        Table5.setFont(new java.awt.Font("Tahoma", 1, 15)); // NOI18N
        Table5.setForeground(new java.awt.Color(255, 255, 255));
        Table5.setText("Table 5");
        Table5.setFocusable(false);
        Table5.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                Table5ActionPerformed(evt);
            }
        });
        jPanel5.add(Table5, new org.netbeans.lib.awtextra.AbsoluteConstraints(980, 140, 90, 60));

        Table4.setBackground(new java.awt.Color(95, 54, 29));
        Table4.setFont(new java.awt.Font("Tahoma", 1, 15)); // NOI18N
        Table4.setForeground(new java.awt.Color(255, 255, 255));
        Table4.setText("Table 4");
        Table4.setFocusable(false);
        Table4.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                Table4ActionPerformed(evt);
            }
        });
        jPanel5.add(Table4, new org.netbeans.lib.awtextra.AbsoluteConstraints(700, 130, 90, 60));

        Table3.setBackground(new java.awt.Color(95, 54, 29));
        Table3.setFont(new java.awt.Font("Tahoma", 1, 15)); // NOI18N
        Table3.setForeground(new java.awt.Color(255, 255, 255));
        Table3.setText("Table 3");
        Table3.setFocusable(false);
        Table3.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                Table3ActionPerformed(evt);
            }
        });
        jPanel5.add(Table3, new org.netbeans.lib.awtextra.AbsoluteConstraints(390, 130, 90, 60));

        jLabel18.setIcon(new javax.swing.ImageIcon(getClass().getResource("/ICON/2 seats.png"))); // NOI18N
        jPanel5.add(jLabel18, new org.netbeans.lib.awtextra.AbsoluteConstraints(40, 40, -1, -1));

        jLabel20.setIcon(new javax.swing.ImageIcon(getClass().getResource("/ICON/4 seats.png"))); // NOI18N
        jPanel5.add(jLabel20, new org.netbeans.lib.awtextra.AbsoluteConstraints(980, 300, -1, -1));

        jLabel21.setIcon(new javax.swing.ImageIcon(getClass().getResource("/ICON/8.png"))); // NOI18N
        jPanel5.add(jLabel21, new org.netbeans.lib.awtextra.AbsoluteConstraints(450, 590, -1, -1));

        jLabel28.setIcon(new javax.swing.ImageIcon(getClass().getResource("/ICON/2 seats.png"))); // NOI18N
        jPanel5.add(jLabel28, new org.netbeans.lib.awtextra.AbsoluteConstraints(170, 40, -1, -1));

        jLabel34.setIcon(new javax.swing.ImageIcon(getClass().getResource("/ICON/4.png"))); // NOI18N
        jPanel5.add(jLabel34, new org.netbeans.lib.awtextra.AbsoluteConstraints(840, 580, -1, 220));

        jLabel35.setIcon(new javax.swing.ImageIcon(getClass().getResource("/ICON/2 seats.png"))); // NOI18N
        jPanel5.add(jLabel35, new org.netbeans.lib.awtextra.AbsoluteConstraints(960, 50, -1, -1));

        jLabel36.setIcon(new javax.swing.ImageIcon(getClass().getResource("/ICON/2 seats.png"))); // NOI18N
        jPanel5.add(jLabel36, new org.netbeans.lib.awtextra.AbsoluteConstraints(1090, 50, -1, -1));

        jLabel37.setIcon(new javax.swing.ImageIcon(getClass().getResource("/ICON/6 seats.png"))); // NOI18N
        jPanel5.add(jLabel37, new org.netbeans.lib.awtextra.AbsoluteConstraints(570, 280, -1, -1));

        jLabel38.setIcon(new javax.swing.ImageIcon(getClass().getResource("/ICON/4 seats.png"))); // NOI18N
        jPanel5.add(jLabel38, new org.netbeans.lib.awtextra.AbsoluteConstraints(320, 50, -1, -1));

        jLabel39.setIcon(new javax.swing.ImageIcon(getClass().getResource("/ICON/2 seats.png"))); // NOI18N
        jPanel5.add(jLabel39, new org.netbeans.lib.awtextra.AbsoluteConstraints(290, 310, -1, -1));

        jLabel42.setIcon(new javax.swing.ImageIcon(getClass().getResource("/ICON/2 seats.png"))); // NOI18N
        jPanel5.add(jLabel42, new org.netbeans.lib.awtextra.AbsoluteConstraints(830, 300, -1, -1));

        jLabel43.setIcon(new javax.swing.ImageIcon(getClass().getResource("/ICON/6 seats.png"))); // NOI18N
        jPanel5.add(jLabel43, new org.netbeans.lib.awtextra.AbsoluteConstraints(40, 270, -1, -1));

        jLabel44.setIcon(new javax.swing.ImageIcon(getClass().getResource("/ICON/2 seats.png"))); // NOI18N
        jPanel5.add(jLabel44, new org.netbeans.lib.awtextra.AbsoluteConstraints(430, 310, -1, -1));

        jLabel45.setIcon(new javax.swing.ImageIcon(getClass().getResource("/ICON/8.png"))); // NOI18N
        jPanel5.add(jLabel45, new org.netbeans.lib.awtextra.AbsoluteConstraints(560, 50, -1, -1));

        jLabel46.setIcon(new javax.swing.ImageIcon(getClass().getResource("/ICON/flower.png"))); // NOI18N
        jPanel5.add(jLabel46, new org.netbeans.lib.awtextra.AbsoluteConstraints(1100, 680, 150, 140));

        jLabel47.setIcon(new javax.swing.ImageIcon(getClass().getResource("/ICON/4.png"))); // NOI18N
        jPanel5.add(jLabel47, new org.netbeans.lib.awtextra.AbsoluteConstraints(190, 580, -1, 220));

        jLabel48.setIcon(new javax.swing.ImageIcon(getClass().getResource("/ICON/flower.png"))); // NOI18N
        jPanel5.add(jLabel48, new org.netbeans.lib.awtextra.AbsoluteConstraints(20, 680, 150, 130));

        tabbedPane.addTab("tab2", jPanel5);

        jPanel6.setBackground(new java.awt.Color(255, 255, 255));

        BtnDelete.setBackground(new java.awt.Color(255, 49, 49));
        BtnDelete.setFont(new java.awt.Font("Tahoma", 1, 18)); // NOI18N
        BtnDelete.setForeground(new java.awt.Color(255, 255, 255));
        BtnDelete.setText("Delete");
        BtnDelete.setBorder(null);
        BtnDelete.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                BtnDeleteActionPerformed(evt);
            }
        });

        ReservationTable.setBackground(new java.awt.Color(252, 250, 238));
        ReservationTable.setFont(new java.awt.Font("Franklin Gothic Book", 0, 14)); // NOI18N
        ReservationTable.setModel(new javax.swing.table.DefaultTableModel(
            new Object [][] {
                {null, null, null, null, null, null, null, null, null}
            },
            new String [] {
                "Id", "First Name", "Last Name", "Date", "Arrival Time", "Departure Time", "Table Number", "Contact Number", "Status"
            }
        ) {
            boolean[] canEdit = new boolean [] {
                false, false, false, false, false, false, false, false, true
            };

            public boolean isCellEditable(int rowIndex, int columnIndex) {
                return canEdit [columnIndex];
            }
        });
        ReservationTable.getTableHeader().setResizingAllowed(false);
        ReservationTable.getTableHeader().setReorderingAllowed(false);
        jScrollPane1.setViewportView(ReservationTable);
        if (ReservationTable.getColumnModel().getColumnCount() > 0) {
            ReservationTable.getColumnModel().getColumn(0).setResizable(false);
            ReservationTable.getColumnModel().getColumn(1).setResizable(false);
            ReservationTable.getColumnModel().getColumn(2).setResizable(false);
            ReservationTable.getColumnModel().getColumn(3).setResizable(false);
            ReservationTable.getColumnModel().getColumn(4).setResizable(false);
            ReservationTable.getColumnModel().getColumn(5).setResizable(false);
            ReservationTable.getColumnModel().getColumn(6).setResizable(false);
            ReservationTable.getColumnModel().getColumn(7).setResizable(false);
            ReservationTable.getColumnModel().getColumn(8).setResizable(false);
        }

        jLabel1.setFont(new java.awt.Font("Franklin Gothic Demi", 1, 30)); // NOI18N
        jLabel1.setText("Customer Reservation List");

        BackUp.setIcon(new javax.swing.ImageIcon(getClass().getResource("/ICON/trashcan.png"))); // NOI18N
        BackUp.addMouseListener(new java.awt.event.MouseAdapter() {
            public void mousePressed(java.awt.event.MouseEvent evt) {
                BackUpMousePressed(evt);
            }
        });

        jLabel19.setIcon(new javax.swing.ImageIcon(getClass().getResource("/ICON/bon.png"))); // NOI18N

        jLabel22.setIcon(new javax.swing.ImageIcon(getClass().getResource("/ICON/food drawing.png"))); // NOI18N

        SearchBtn.setIcon(new javax.swing.ImageIcon(getClass().getResource("/ICON/search.png"))); // NOI18N

        SearchField.setFont(new java.awt.Font("Tahoma", 0, 12)); // NOI18N
        SearchField.setText("Search for customer");
        SearchField.addKeyListener(new java.awt.event.KeyAdapter() {
            public void keyReleased(java.awt.event.KeyEvent evt) {
                SearchFieldKeyReleased(evt);
            }
        });

        javax.swing.GroupLayout jPanel6Layout = new javax.swing.GroupLayout(jPanel6);
        jPanel6.setLayout(jPanel6Layout);
        jPanel6Layout.setHorizontalGroup(
            jPanel6Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel6Layout.createSequentialGroup()
                .addGap(83, 83, 83)
                .addComponent(jLabel19)
                .addGap(310, 310, 310)
                .addComponent(BtnDelete, javax.swing.GroupLayout.PREFERRED_SIZE, 125, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                .addComponent(jLabel22)
                .addGap(29, 29, 29))
            .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, jPanel6Layout.createSequentialGroup()
                .addContainerGap(177, Short.MAX_VALUE)
                .addGroup(jPanel6Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.TRAILING)
                    .addComponent(jScrollPane1, javax.swing.GroupLayout.PREFERRED_SIZE, 943, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addGroup(jPanel6Layout.createSequentialGroup()
                        .addComponent(jLabel1)
                        .addGap(33, 33, 33)
                        .addComponent(SearchField, javax.swing.GroupLayout.PREFERRED_SIZE, 200, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                        .addComponent(SearchBtn)
                        .addGap(1, 1, 1)
                        .addComponent(BackUp, javax.swing.GroupLayout.PREFERRED_SIZE, 37, javax.swing.GroupLayout.PREFERRED_SIZE)))
                .addGap(170, 170, 170))
        );
        jPanel6Layout.setVerticalGroup(
            jPanel6Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel6Layout.createSequentialGroup()
                .addGap(57, 57, 57)
                .addGroup(jPanel6Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.TRAILING, false)
                    .addComponent(jLabel1, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                    .addComponent(BackUp, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                    .addComponent(SearchField)
                    .addComponent(SearchBtn, javax.swing.GroupLayout.Alignment.LEADING, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
                .addGroup(jPanel6Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, jPanel6Layout.createSequentialGroup()
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                        .addComponent(jLabel19)
                        .addGap(34, 34, 34))
                    .addGroup(jPanel6Layout.createSequentialGroup()
                        .addGap(42, 42, 42)
                        .addComponent(jScrollPane1, javax.swing.GroupLayout.PREFERRED_SIZE, 500, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addGroup(jPanel6Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addGroup(jPanel6Layout.createSequentialGroup()
                                .addGap(33, 33, 33)
                                .addComponent(jLabel22))
                            .addGroup(jPanel6Layout.createSequentialGroup()
                                .addGap(62, 62, 62)
                                .addComponent(BtnDelete, javax.swing.GroupLayout.PREFERRED_SIZE, 44, javax.swing.GroupLayout.PREFERRED_SIZE)))
                        .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))))
        );

        tabbedPane.addTab("tab3", jPanel6);

        jPanel18.setBackground(new java.awt.Color(255, 255, 255));

        AddCustomer.setBackground(new java.awt.Color(250, 207, 16));
        AddCustomer.setFont(new java.awt.Font("Tahoma", 1, 18)); // NOI18N
        AddCustomer.setForeground(new java.awt.Color(255, 255, 255));
        AddCustomer.setText("+ Add customer");
        AddCustomer.setBorder(null);
        AddCustomer.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                AddCustomerActionPerformed(evt);
            }
        });

        WaitlistTable.setBackground(new java.awt.Color(252, 250, 238));
        WaitlistTable.setFont(new java.awt.Font("Franklin Gothic Book", 0, 14)); // NOI18N
        WaitlistTable.setModel(new javax.swing.table.DefaultTableModel(
            new Object [][] {

            },
            new String [] {
                "Id", "First Name", "Last Name", "Date", "Arrival Time", "Departure Time", "Table Number", "Contact Number", "Status"
            }
        ) {
            boolean[] canEdit = new boolean [] {
                false, false, false, false, false, false, false, false, true
            };

            public boolean isCellEditable(int rowIndex, int columnIndex) {
                return canEdit [columnIndex];
            }
        });
        WaitlistTable.getTableHeader().setResizingAllowed(false);
        WaitlistTable.getTableHeader().setReorderingAllowed(false);
        jScrollPane2.setViewportView(WaitlistTable);
        if (WaitlistTable.getColumnModel().getColumnCount() > 0) {
            WaitlistTable.getColumnModel().getColumn(0).setResizable(false);
            WaitlistTable.getColumnModel().getColumn(1).setResizable(false);
            WaitlistTable.getColumnModel().getColumn(2).setResizable(false);
            WaitlistTable.getColumnModel().getColumn(3).setResizable(false);
            WaitlistTable.getColumnModel().getColumn(4).setResizable(false);
            WaitlistTable.getColumnModel().getColumn(5).setResizable(false);
            WaitlistTable.getColumnModel().getColumn(6).setResizable(false);
            WaitlistTable.getColumnModel().getColumn(7).setResizable(false);
            WaitlistTable.getColumnModel().getColumn(8).setResizable(false);
        }

        jLabel5.setFont(new java.awt.Font("Franklin Gothic Demi", 1, 30)); // NOI18N
        jLabel5.setText("Walk-in Customer List");

        jLabel14.setIcon(new javax.swing.ImageIcon(getClass().getResource("/ICON/spoon.png"))); // NOI18N

        jLabel15.setIcon(new javax.swing.ImageIcon(getClass().getResource("/ICON/menuu.png"))); // NOI18N

        search.setIcon(new javax.swing.ImageIcon(getClass().getResource("/ICON/search.png"))); // NOI18N

        walkinsearch.setText("Search for customer");
        walkinsearch.addKeyListener(new java.awt.event.KeyAdapter() {
            public void keyReleased(java.awt.event.KeyEvent evt) {
                walkinsearchKeyReleased(evt);
            }
        });

        javax.swing.GroupLayout jPanel18Layout = new javax.swing.GroupLayout(jPanel18);
        jPanel18.setLayout(jPanel18Layout);
        jPanel18Layout.setHorizontalGroup(
            jPanel18Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, jPanel18Layout.createSequentialGroup()
                .addGroup(jPanel18Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.TRAILING)
                    .addGroup(jPanel18Layout.createSequentialGroup()
                        .addGap(40, 40, 40)
                        .addComponent(jLabel14, javax.swing.GroupLayout.PREFERRED_SIZE, 216, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                        .addComponent(AddCustomer, javax.swing.GroupLayout.PREFERRED_SIZE, 219, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addGap(264, 264, 264)
                        .addComponent(jLabel15, javax.swing.GroupLayout.PREFERRED_SIZE, 185, javax.swing.GroupLayout.PREFERRED_SIZE))
                    .addGroup(jPanel18Layout.createSequentialGroup()
                        .addGroup(jPanel18Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.TRAILING)
                            .addGroup(jPanel18Layout.createSequentialGroup()
                                .addGap(0, 0, Short.MAX_VALUE)
                                .addComponent(jLabel5)
                                .addGap(62, 62, 62)
                                .addComponent(walkinsearch, javax.swing.GroupLayout.PREFERRED_SIZE, 200, javax.swing.GroupLayout.PREFERRED_SIZE)
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                .addComponent(search))
                            .addGroup(jPanel18Layout.createSequentialGroup()
                                .addContainerGap(177, Short.MAX_VALUE)
                                .addComponent(jScrollPane2, javax.swing.GroupLayout.PREFERRED_SIZE, 943, javax.swing.GroupLayout.PREFERRED_SIZE)))
                        .addGap(86, 86, 86)))
                .addGap(84, 84, 84))
        );
        jPanel18Layout.setVerticalGroup(
            jPanel18Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel18Layout.createSequentialGroup()
                .addGap(57, 57, 57)
                .addGroup(jPanel18Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(jLabel5)
                    .addGroup(jPanel18Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.TRAILING, false)
                        .addComponent(walkinsearch)
                        .addComponent(search, javax.swing.GroupLayout.Alignment.LEADING)))
                .addGap(42, 42, 42)
                .addComponent(jScrollPane2, javax.swing.GroupLayout.PREFERRED_SIZE, 500, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGroup(jPanel18Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(jPanel18Layout.createSequentialGroup()
                        .addGap(42, 42, 42)
                        .addComponent(jLabel14, javax.swing.GroupLayout.PREFERRED_SIZE, 104, javax.swing.GroupLayout.PREFERRED_SIZE))
                    .addGroup(jPanel18Layout.createSequentialGroup()
                        .addGap(57, 57, 57)
                        .addGroup(jPanel18Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addComponent(jLabel15, javax.swing.GroupLayout.PREFERRED_SIZE, 71, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addComponent(AddCustomer, javax.swing.GroupLayout.PREFERRED_SIZE, 51, javax.swing.GroupLayout.PREFERRED_SIZE))))
                .addContainerGap(55, Short.MAX_VALUE))
        );

        tabbedPane.addTab("tab5", jPanel18);

        jPanel8.setBackground(new java.awt.Color(255, 255, 255));

        jLabel8.setFont(new java.awt.Font("Franklin Gothic Demi", 1, 30)); // NOI18N
        jLabel8.setText("Ongoing Customer List");

        OngoingTable.setBackground(new java.awt.Color(252, 250, 238));
        OngoingTable.setFont(new java.awt.Font("Franklin Gothic Book", 0, 14)); // NOI18N
        OngoingTable.setModel(new javax.swing.table.DefaultTableModel(
            new Object [][] {

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
        OngoingTable.getTableHeader().setResizingAllowed(false);
        OngoingTable.getTableHeader().setReorderingAllowed(false);
        jScrollPane3.setViewportView(OngoingTable);
        if (OngoingTable.getColumnModel().getColumnCount() > 0) {
            OngoingTable.getColumnModel().getColumn(0).setResizable(false);
            OngoingTable.getColumnModel().getColumn(1).setResizable(false);
            OngoingTable.getColumnModel().getColumn(2).setResizable(false);
            OngoingTable.getColumnModel().getColumn(3).setResizable(false);
            OngoingTable.getColumnModel().getColumn(4).setResizable(false);
            OngoingTable.getColumnModel().getColumn(5).setResizable(false);
            OngoingTable.getColumnModel().getColumn(6).setResizable(false);
            OngoingTable.getColumnModel().getColumn(7).setResizable(false);
            OngoingTable.getColumnModel().getColumn(8).setResizable(false);
        }

        history.setIcon(new javax.swing.ImageIcon(getClass().getResource("/ICON/history.png"))); // NOI18N
        history.addMouseListener(new java.awt.event.MouseAdapter() {
            public void mousePressed(java.awt.event.MouseEvent evt) {
                historyMousePressed(evt);
            }
        });

        jLabel16.setIcon(new javax.swing.ImageIcon(getClass().getResource("/ICON/serve.png"))); // NOI18N

        jLabel17.setIcon(new javax.swing.ImageIcon(getClass().getResource("/ICON/resto table.png"))); // NOI18N

        javax.swing.GroupLayout jPanel8Layout = new javax.swing.GroupLayout(jPanel8);
        jPanel8.setLayout(jPanel8Layout);
        jPanel8Layout.setHorizontalGroup(
            jPanel8Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel8Layout.createSequentialGroup()
                .addContainerGap()
                .addComponent(jLabel16)
                .addGroup(jPanel8Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(jPanel8Layout.createSequentialGroup()
                        .addGap(11, 11, 11)
                        .addGroup(jPanel8Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.TRAILING)
                            .addComponent(jScrollPane3, javax.swing.GroupLayout.PREFERRED_SIZE, 943, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addGroup(jPanel8Layout.createSequentialGroup()
                                .addComponent(jLabel8)
                                .addGap(255, 255, 255)
                                .addComponent(history)))
                        .addContainerGap(182, Short.MAX_VALUE))
                    .addGroup(jPanel8Layout.createSequentialGroup()
                        .addGap(389, 929, Short.MAX_VALUE)
                        .addComponent(jLabel17)
                        .addGap(20, 20, 20))))
        );
        jPanel8Layout.setVerticalGroup(
            jPanel8Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel8Layout.createSequentialGroup()
                .addGap(57, 57, 57)
                .addGroup(jPanel8Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(history, javax.swing.GroupLayout.PREFERRED_SIZE, 35, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(jLabel8))
                .addGap(42, 42, 42)
                .addComponent(jScrollPane3, javax.swing.GroupLayout.PREFERRED_SIZE, 500, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED, 34, Short.MAX_VALUE)
                .addGroup(jPanel8Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(jLabel17)
                    .addComponent(jLabel16))
                .addGap(25, 25, 25))
        );

        tabbedPane.addTab("tab6", jPanel8);

        jPanel7.setBackground(new java.awt.Color(255, 255, 255));
        jPanel7.setLayout(new org.netbeans.lib.awtextra.AbsoluteLayout());

        jPanel10.setBackground(new java.awt.Color(0, 0, 0, 150));

        jLabel11.setFont(new java.awt.Font("Franklin Gothic Book", 1, 24)); // NOI18N
        jLabel11.setForeground(new java.awt.Color(255, 255, 255));
        jLabel11.setIcon(new javax.swing.ImageIcon(getClass().getResource("/ICON/admin-profile (1).png"))); // NOI18N

        javax.swing.GroupLayout jPanel10Layout = new javax.swing.GroupLayout(jPanel10);
        jPanel10.setLayout(jPanel10Layout);
        jPanel10Layout.setHorizontalGroup(
            jPanel10Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, jPanel10Layout.createSequentialGroup()
                .addContainerGap(547, Short.MAX_VALUE)
                .addComponent(jLabel11)
                .addGap(533, 533, 533))
        );
        jPanel10Layout.setVerticalGroup(
            jPanel10Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel10Layout.createSequentialGroup()
                .addGap(60, 60, 60)
                .addComponent(jLabel11)
                .addContainerGap(60, Short.MAX_VALUE))
        );

        jPanel7.add(jPanel10, new org.netbeans.lib.awtextra.AbsoluteConstraints(10, 10, 1280, -1));

        jLabel7.setIcon(new javax.swing.ImageIcon(getClass().getResource("/ICON/background-resize.jpg"))); // NOI18N
        jPanel7.add(jLabel7, new org.netbeans.lib.awtextra.AbsoluteConstraints(10, 10, 1280, -1));
        jLabel7.getAccessibleContext().setAccessibleName("");
        jLabel7.getAccessibleContext().setAccessibleParent(jPanel7);

        jLabel29.setFont(new java.awt.Font("Franklin Gothic Book", 1, 20)); // NOI18N
        jLabel29.setText("Role:");
        jPanel7.add(jLabel29, new org.netbeans.lib.awtextra.AbsoluteConstraints(800, 560, 50, 30));

        jLabel30.setFont(new java.awt.Font("Franklin Gothic Book", 1, 20)); // NOI18N
        jLabel30.setText("First Name:");
        jPanel7.add(jLabel30, new org.netbeans.lib.awtextra.AbsoluteConstraints(300, 480, 110, 30));

        jLabel31.setFont(new java.awt.Font("Franklin Gothic Demi", 1, 48)); // NOI18N
        jLabel31.setText("My Profile");
        jPanel7.add(jLabel31, new org.netbeans.lib.awtextra.AbsoluteConstraints(570, 360, 230, 50));

        jLabel32.setFont(new java.awt.Font("Franklin Gothic Book", 1, 20)); // NOI18N
        jLabel32.setText("Username:");
        jPanel7.add(jLabel32, new org.netbeans.lib.awtextra.AbsoluteConstraints(300, 560, 100, 30));

        jLabel33.setFont(new java.awt.Font("Franklin Gothic Book", 1, 20)); // NOI18N
        jLabel33.setText("Password:");
        jPanel7.add(jLabel33, new org.netbeans.lib.awtextra.AbsoluteConstraints(300, 650, 110, 30));

        jPanel13.setBackground(new java.awt.Color(252, 250, 238));

        FName.setFont(new java.awt.Font("Franklin Gothic Book", 0, 20)); // NOI18N

        javax.swing.GroupLayout jPanel13Layout = new javax.swing.GroupLayout(jPanel13);
        jPanel13.setLayout(jPanel13Layout);
        jPanel13Layout.setHorizontalGroup(
            jPanel13Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel13Layout.createSequentialGroup()
                .addGap(15, 15, 15)
                .addComponent(FName, javax.swing.GroupLayout.PREFERRED_SIZE, 190, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addContainerGap(35, Short.MAX_VALUE))
        );
        jPanel13Layout.setVerticalGroup(
            jPanel13Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, jPanel13Layout.createSequentialGroup()
                .addContainerGap()
                .addComponent(FName, javax.swing.GroupLayout.DEFAULT_SIZE, 38, Short.MAX_VALUE)
                .addContainerGap())
        );

        jPanel7.add(jPanel13, new org.netbeans.lib.awtextra.AbsoluteConstraints(420, 470, -1, -1));

        jPanel17.setBackground(new java.awt.Color(252, 250, 238));

        LName.setFont(new java.awt.Font("Franklin Gothic Book", 0, 20)); // NOI18N

        javax.swing.GroupLayout jPanel17Layout = new javax.swing.GroupLayout(jPanel17);
        jPanel17.setLayout(jPanel17Layout);
        jPanel17Layout.setHorizontalGroup(
            jPanel17Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel17Layout.createSequentialGroup()
                .addGap(15, 15, 15)
                .addComponent(LName, javax.swing.GroupLayout.PREFERRED_SIZE, 190, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addContainerGap(35, Short.MAX_VALUE))
        );
        jPanel17Layout.setVerticalGroup(
            jPanel17Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, jPanel17Layout.createSequentialGroup()
                .addContainerGap()
                .addComponent(LName, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                .addContainerGap())
        );

        jPanel7.add(jPanel17, new org.netbeans.lib.awtextra.AbsoluteConstraints(870, 470, -1, 50));

        jLabel40.setFont(new java.awt.Font("Franklin Gothic Book", 1, 20)); // NOI18N
        jLabel40.setText("Last Login:");
        jPanel7.add(jLabel40, new org.netbeans.lib.awtextra.AbsoluteConstraints(750, 650, 100, 30));

        jPanel20.setBackground(new java.awt.Color(252, 250, 238));

        Role.setFont(new java.awt.Font("Franklin Gothic Book", 0, 20)); // NOI18N
        Role.setText("System Administrator");

        javax.swing.GroupLayout jPanel20Layout = new javax.swing.GroupLayout(jPanel20);
        jPanel20.setLayout(jPanel20Layout);
        jPanel20Layout.setHorizontalGroup(
            jPanel20Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel20Layout.createSequentialGroup()
                .addGap(15, 15, 15)
                .addComponent(Role, javax.swing.GroupLayout.PREFERRED_SIZE, 190, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addContainerGap(35, Short.MAX_VALUE))
        );
        jPanel20Layout.setVerticalGroup(
            jPanel20Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, jPanel20Layout.createSequentialGroup()
                .addContainerGap()
                .addComponent(Role, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                .addContainerGap())
        );

        jPanel7.add(jPanel20, new org.netbeans.lib.awtextra.AbsoluteConstraints(870, 550, -1, 50));

        jPanel19.setBackground(new java.awt.Color(252, 250, 238));

        UName.setFont(new java.awt.Font("Franklin Gothic Book", 0, 20)); // NOI18N

        javax.swing.GroupLayout jPanel19Layout = new javax.swing.GroupLayout(jPanel19);
        jPanel19.setLayout(jPanel19Layout);
        jPanel19Layout.setHorizontalGroup(
            jPanel19Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel19Layout.createSequentialGroup()
                .addGap(15, 15, 15)
                .addComponent(UName, javax.swing.GroupLayout.PREFERRED_SIZE, 190, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addContainerGap(35, Short.MAX_VALUE))
        );
        jPanel19Layout.setVerticalGroup(
            jPanel19Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, jPanel19Layout.createSequentialGroup()
                .addGap(6, 6, 6)
                .addComponent(UName, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                .addContainerGap())
        );

        jPanel7.add(jPanel19, new org.netbeans.lib.awtextra.AbsoluteConstraints(420, 550, -1, 50));

        jPanel21.setBackground(new java.awt.Color(252, 250, 238));

        dateLabel.setFont(new java.awt.Font("Franklin Gothic Book", 0, 16)); // NOI18N

        javax.swing.GroupLayout jPanel21Layout = new javax.swing.GroupLayout(jPanel21);
        jPanel21.setLayout(jPanel21Layout);
        jPanel21Layout.setHorizontalGroup(
            jPanel21Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel21Layout.createSequentialGroup()
                .addGap(15, 15, 15)
                .addComponent(dateLabel, javax.swing.GroupLayout.DEFAULT_SIZE, 219, Short.MAX_VALUE)
                .addContainerGap())
        );
        jPanel21Layout.setVerticalGroup(
            jPanel21Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, jPanel21Layout.createSequentialGroup()
                .addContainerGap()
                .addComponent(dateLabel, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                .addContainerGap())
        );

        jPanel7.add(jPanel21, new org.netbeans.lib.awtextra.AbsoluteConstraints(870, 640, -1, 50));

        jLabel49.setFont(new java.awt.Font("Franklin Gothic Book", 1, 20)); // NOI18N
        jLabel49.setText("Last Name:");
        jPanel7.add(jLabel49, new org.netbeans.lib.awtextra.AbsoluteConstraints(750, 480, 110, 30));

        jPanel22.setBackground(new java.awt.Color(252, 250, 238));

        passWord.setFont(new java.awt.Font("Franklin Gothic Book", 0, 20)); // NOI18N

        javax.swing.GroupLayout jPanel22Layout = new javax.swing.GroupLayout(jPanel22);
        jPanel22.setLayout(jPanel22Layout);
        jPanel22Layout.setHorizontalGroup(
            jPanel22Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel22Layout.createSequentialGroup()
                .addGap(15, 15, 15)
                .addComponent(passWord, javax.swing.GroupLayout.PREFERRED_SIZE, 212, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addContainerGap(13, Short.MAX_VALUE))
        );
        jPanel22Layout.setVerticalGroup(
            jPanel22Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel22Layout.createSequentialGroup()
                .addContainerGap()
                .addComponent(passWord, javax.swing.GroupLayout.DEFAULT_SIZE, 38, Short.MAX_VALUE)
                .addContainerGap())
        );

        jPanel7.add(jPanel22, new org.netbeans.lib.awtextra.AbsoluteConstraints(420, 640, -1, -1));

        tabbedPane.addTab("tab4", jPanel7);

        jPanel1.add(tabbedPane, new org.netbeans.lib.awtextra.AbsoluteConstraints(250, 0, 1290, 870));

        getContentPane().add(jPanel1, new org.netbeans.lib.awtextra.AbsoluteConstraints(0, 0, -1, 1042));

        pack();
    }// </editor-fold>//GEN-END:initComponents

    private void signOutMouseClicked(java.awt.event.MouseEvent evt) {//GEN-FIRST:event_signOutMouseClicked
        int confirmed = JOptionPane.showConfirmDialog(null, "Are you sure you want to exit?", "EXIT", JOptionPane.YES_NO_OPTION);
        if (confirmed == JOptionPane.YES_OPTION) {
           LoginFrame login = new LoginFrame();
           login.setVisible(true);
           this.dispose();
        }       
    }//GEN-LAST:event_signOutMouseClicked

    private void signOut2MouseClicked(java.awt.event.MouseEvent evt) {//GEN-FIRST:event_signOut2MouseClicked
        Dashboard.setForeground(DefaultFontColor);
        Tables.setForeground(DefaultFontColor);
        Reservation.setForeground(DefaultFontColor);
        User.setForeground(DefaultFontColor);
        signOut2.setForeground(ClickedFontColor);
        Waitlist.setForeground(DefaultFontColor);
        
        DashboardPanel.setBackground(DefaultColor);
        TablesPanel.setBackground(DefaultColor);
        ReservationPanel.setBackground(DefaultColor);
        UserPanel.setBackground(DefaultColor);
        SignoutPanel.setBackground(ClickedColor);
        WaitlistPanel.setBackground(DefaultColor);
        
        int confirmed = JOptionPane.showConfirmDialog(null, "Are you sure you want to exit?", "EXIT", JOptionPane.YES_NO_OPTION);
        if (confirmed == JOptionPane.YES_OPTION) {
           LoginFrame login = new LoginFrame();
           login.setVisible(true);
           this.dispose();
        }       
    }//GEN-LAST:event_signOut2MouseClicked

    private void DashboardPanelMousePressed(java.awt.event.MouseEvent evt) {//GEN-FIRST:event_DashboardPanelMousePressed
        DashboardPanel.setBackground(ClickedColor);
        TablesPanel.setBackground(DefaultColor);
        ReservationPanel.setBackground(DefaultColor);
        UserPanel.setBackground(DefaultColor);
        SignoutPanel.setBackground(DefaultColor);
        WaitlistPanel.setBackground(DefaultColor);
        OngoingPanel.setBackground(DefaultColor);
        
        Dashboard.setForeground(ClickedFontColor);
        Tables.setForeground(DefaultFontColor);
        Reservation.setForeground(DefaultFontColor);
        User.setForeground(DefaultFontColor);
        signOut2.setForeground(DefaultFontColor);
        Waitlist.setForeground(DefaultFontColor);
        Ongoing.setForeground(DefaultFontColor);
        
        MenuName.setText("Dashboard");
        tabbedPane.setSelectedIndex(0);
    }//GEN-LAST:event_DashboardPanelMousePressed

    private void TablesPanelMousePressed(java.awt.event.MouseEvent evt) {//GEN-FIRST:event_TablesPanelMousePressed
        DashboardPanel.setBackground(DefaultColor);
        TablesPanel.setBackground(ClickedColor);
        ReservationPanel.setBackground(DefaultColor);
        UserPanel.setBackground(DefaultColor);
        SignoutPanel.setBackground(DefaultColor);
        WaitlistPanel.setBackground(DefaultColor);
        OngoingPanel.setBackground(DefaultColor);
        
        Dashboard.setForeground(DefaultFontColor);
        Tables.setForeground(ClickedFontColor);
        Reservation.setForeground(DefaultFontColor);
        User.setForeground(DefaultFontColor);
        signOut2.setForeground(DefaultFontColor);
        Waitlist.setForeground(DefaultFontColor);
        Ongoing.setForeground(DefaultFontColor);
        
        MenuName.setText("Tables");
        tabbedPane.setSelectedIndex(1);
    }//GEN-LAST:event_TablesPanelMousePressed

    private void ReservationPanelMousePressed(java.awt.event.MouseEvent evt) {//GEN-FIRST:event_ReservationPanelMousePressed
        DashboardPanel.setBackground(DefaultColor);
        TablesPanel.setBackground(DefaultColor);
        ReservationPanel.setBackground(ClickedColor);
        UserPanel.setBackground(DefaultColor);
        SignoutPanel.setBackground(DefaultColor);
        WaitlistPanel.setBackground(DefaultColor);
        OngoingPanel.setBackground(DefaultColor);
        
        Dashboard.setForeground(DefaultFontColor);
        Tables.setForeground(DefaultFontColor);
        Reservation.setForeground(ClickedFontColor);
        User.setForeground(DefaultFontColor);
        signOut2.setForeground(DefaultFontColor);
        Waitlist.setForeground(DefaultFontColor);
        Ongoing.setForeground(DefaultFontColor);
        
        MenuName.setText("Reservation");
        tabbedPane.setSelectedIndex(2);
    }//GEN-LAST:event_ReservationPanelMousePressed

    private void UserPanelMousePressed(java.awt.event.MouseEvent evt) {//GEN-FIRST:event_UserPanelMousePressed
        DashboardPanel.setBackground(DefaultColor);
        TablesPanel.setBackground(DefaultColor);
        ReservationPanel.setBackground(DefaultColor);
        UserPanel.setBackground(ClickedColor);
        SignoutPanel.setBackground(DefaultColor);
        WaitlistPanel.setBackground(DefaultColor);
        OngoingPanel.setBackground(DefaultColor);
        
        Dashboard.setForeground(DefaultFontColor);
        Tables.setForeground(DefaultFontColor);
        Reservation.setForeground(DefaultFontColor);
        User.setForeground(ClickedFontColor);
        signOut2.setForeground(DefaultFontColor);
        Waitlist.setForeground(DefaultFontColor);
        Ongoing.setForeground(DefaultFontColor);
        
        MenuName.setText("User");
        tabbedPane.setSelectedIndex(5);
    }//GEN-LAST:event_UserPanelMousePressed

    private void AddCustomerActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_AddCustomerActionPerformed
        WaitListCustomer addCustomer = new WaitListCustomer(this);
        addCustomer.setVisible(true);
        this.dispose();
    }//GEN-LAST:event_AddCustomerActionPerformed

    private void BtnDeleteActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_BtnDeleteActionPerformed
        int selectedRow = ReservationTable.getSelectedRow();
        if (selectedRow == -1) { 
            javax.swing.JOptionPane.showMessageDialog(null, "Please select a row to delete.");
            return;
        }
        String status = ReservationTable.getValueAt(selectedRow, 8).toString();
        if (!"Pending".equals(status)) {
           javax.swing.JOptionPane.showMessageDialog(null, "You can only delete Pending reservations.");
            return;
        }
        Object[] rowData = new Object[9];
        for (int i = 0; i < rowData.length; i++) {
            rowData[i] = ReservationTable.getValueAt(selectedRow, i);
        }
        String backupQuery = "INSERT INTO `backup`(`Id`, `Date`, `Arrival Time`, `Departure Time`, `Firstname`, `Lastname`, `Table Number`, `Contact Number`, `Status`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        String deleteQuery = "DELETE FROM `customer_reservation` WHERE `Id` = ?";
        try (
            PreparedStatement pst = con.prepareStatement(backupQuery);
            PreparedStatement deletePst = con.prepareStatement(deleteQuery)
            ) { 
            pst.setString(1, rowData[0].toString());  // Id (index 0)
            pst.setString(2, rowData[3].toString());  // Date (index 3)
            pst.setString(3, rowData[4].toString());  // Arrival Time (index 4)
            pst.setString(4, rowData[5].toString());  // Departure Time (index 5)
            pst.setString(5, rowData[1].toString());  // Firstname (index 1)
            pst.setString(6, rowData[2].toString());  // Lastname (index 2)
            pst.setString(7, rowData[6].toString());  // Table Number (index 6)
            pst.setString(8, rowData[7].toString());  // Contact Number (index 7)
            pst.setString(9, rowData[8].toString());  // Status (index 8)

            int backupResult = pst.executeUpdate();
            if (backupResult > 0) {
                deletePst.setString(1, rowData[0].toString());
                deletePst.executeUpdate();
                
                ((DefaultTableModel) ReservationTable.getModel()).removeRow(selectedRow);
                
                javax.swing.JOptionPane.showMessageDialog(null, "Reservation deleted and backed up successfully.");
            } 
        } catch (SQLException ex) {
            javax.swing.JOptionPane.showMessageDialog(null, "Database error: " + ex.getMessage());
        }
    }//GEN-LAST:event_BtnDeleteActionPerformed

    private void WaitlistPanelMousePressed(java.awt.event.MouseEvent evt) {//GEN-FIRST:event_WaitlistPanelMousePressed
        DashboardPanel.setBackground(DefaultColor);
        TablesPanel.setBackground(DefaultColor);
        ReservationPanel.setBackground(DefaultColor);
        UserPanel.setBackground(DefaultColor);
        SignoutPanel.setBackground(DefaultColor);
        WaitlistPanel.setBackground(ClickedColor);
        OngoingPanel.setBackground(DefaultColor);
        
        Dashboard.setForeground(DefaultFontColor);
        Tables.setForeground(DefaultFontColor);
        Reservation.setForeground(DefaultFontColor);
        User.setForeground(DefaultFontColor);
        signOut2.setForeground(DefaultFontColor);
        Waitlist.setForeground(ClickedFontColor);
        Ongoing.setForeground(DefaultFontColor);
        
        MenuName.setText("Waitlist");
        tabbedPane.setSelectedIndex(3);
    }//GEN-LAST:event_WaitlistPanelMousePressed

    private void Table1ActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_Table1ActionPerformed
        handleTableAction("Table No. 1");
    }//GEN-LAST:event_Table1ActionPerformed

    private void Table2ActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_Table2ActionPerformed
        handleTableAction("Table No. 2");
    }//GEN-LAST:event_Table2ActionPerformed

    private void Table9ActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_Table9ActionPerformed
        handleTableAction("Table No. 9");
    }//GEN-LAST:event_Table9ActionPerformed

    private void Table10ActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_Table10ActionPerformed
        handleTableAction("Table No. 10");
    }//GEN-LAST:event_Table10ActionPerformed

    private void Table15ActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_Table15ActionPerformed
        handleTableAction("Table No. 15");
    }//GEN-LAST:event_Table15ActionPerformed

    private void Table3ActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_Table3ActionPerformed
        handleTableAction("Table No. 3");
    }//GEN-LAST:event_Table3ActionPerformed

    private void Table4ActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_Table4ActionPerformed
        handleTableAction("Table No. 4");
    }//GEN-LAST:event_Table4ActionPerformed

    private void Table5ActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_Table5ActionPerformed
        handleTableAction("Table No. 5");
    }//GEN-LAST:event_Table5ActionPerformed

    private void Table6ActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_Table6ActionPerformed
        handleTableAction("Table No. 6");
    }//GEN-LAST:event_Table6ActionPerformed

    private void Table7ActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_Table7ActionPerformed
        handleTableAction("Table No. 7");
    }//GEN-LAST:event_Table7ActionPerformed

    private void Table8ActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_Table8ActionPerformed
        handleTableAction("Table No. 8");
    }//GEN-LAST:event_Table8ActionPerformed

    private void Table11ActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_Table11ActionPerformed
        handleTableAction("Table No. 11");
    }//GEN-LAST:event_Table11ActionPerformed

    private void Table12ActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_Table12ActionPerformed
        handleTableAction("Table No. 12");   
    }//GEN-LAST:event_Table12ActionPerformed

    private void Table13ActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_Table13ActionPerformed
        handleTableAction("Table No. 13");              
    }//GEN-LAST:event_Table13ActionPerformed

    private void Table14ActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_Table14ActionPerformed
        handleTableAction("Table No. 14");
    }//GEN-LAST:event_Table14ActionPerformed

    private void OngoingPanelMousePressed(java.awt.event.MouseEvent evt) {//GEN-FIRST:event_OngoingPanelMousePressed
        DashboardPanel.setBackground(DefaultColor);
        TablesPanel.setBackground(DefaultColor);
        ReservationPanel.setBackground(DefaultColor);
        UserPanel.setBackground(DefaultColor);
        SignoutPanel.setBackground(DefaultColor);
        WaitlistPanel.setBackground(DefaultColor);
        OngoingPanel.setBackground(ClickedColor);
        
        Dashboard.setForeground(DefaultFontColor);
        Tables.setForeground(DefaultFontColor);
        Reservation.setForeground(DefaultFontColor);
        User.setForeground(DefaultFontColor);
        signOut2.setForeground(DefaultFontColor);
        Waitlist.setForeground(DefaultFontColor);
        Ongoing.setForeground(ClickedFontColor);
        
        MenuName.setText("Ongoing Customer");
        tabbedPane.setSelectedIndex(4);
    }//GEN-LAST:event_OngoingPanelMousePressed

    private void BackUpMousePressed(java.awt.event.MouseEvent evt) {//GEN-FIRST:event_BackUpMousePressed
        this.dispose();
        DeletedReservation dr = new DeletedReservation(this);
        dr.setVisible(true);
    }//GEN-LAST:event_BackUpMousePressed

    private void historyMousePressed(java.awt.event.MouseEvent evt) {//GEN-FIRST:event_historyMousePressed
        this.dispose();
        customerHistory = new CustomerHistory(this);
        customerHistory.setVisible(true);
    }//GEN-LAST:event_historyMousePressed

    private void walkinsearchKeyReleased(java.awt.event.KeyEvent evt) {//GEN-FIRST:event_walkinsearchKeyReleased
        String searchNames = walkinsearch.getText();
        searchWalkin(searchNames);
    }//GEN-LAST:event_walkinsearchKeyReleased

    private void SearchFieldKeyReleased(java.awt.event.KeyEvent evt) {//GEN-FIRST:event_SearchFieldKeyReleased
        String searchNames = SearchField.getText();
        search(searchNames);
    }//GEN-LAST:event_SearchFieldKeyReleased
    public static void main(String args[]) {
        java.awt.EventQueue.invokeLater(() -> {
            Dashboard dashboard = new Dashboard();
            dashboard.setVisible(true);
        });
    }
    // Variables declaration - do not modify//GEN-BEGIN:variables
    private javax.swing.JButton AddCustomer;
    private javax.swing.JLabel BackUp;
    private javax.swing.JButton BtnDelete;
    private javax.swing.JLabel Dashboard;
    private javax.swing.JLabel DashboardIcon;
    private javax.swing.JPanel DashboardPanel;
    private javax.swing.JLabel FName;
    private javax.swing.JLabel LName;
    private javax.swing.JLabel MenuName;
    private javax.swing.JLabel Ongoing;
    private javax.swing.JPanel OngoingPanel;
    private javax.swing.JTable OngoingTable;
    private javax.swing.JLabel Reservation;
    private javax.swing.JPanel ReservationPanel;
    private javax.swing.JTable ReservationTable;
    private javax.swing.JLabel ReserveIcon;
    private javax.swing.JLabel Role;
    private javax.swing.JLabel SearchBtn;
    private javax.swing.JTextField SearchField;
    private javax.swing.JPanel SignoutPanel;
    private javax.swing.JButton Table1;
    private javax.swing.JButton Table10;
    private javax.swing.JButton Table11;
    private javax.swing.JButton Table12;
    private javax.swing.JButton Table13;
    private javax.swing.JButton Table14;
    private javax.swing.JButton Table15;
    private javax.swing.JButton Table2;
    private javax.swing.JButton Table3;
    private javax.swing.JButton Table4;
    private javax.swing.JButton Table5;
    private javax.swing.JButton Table6;
    private javax.swing.JButton Table7;
    private javax.swing.JButton Table8;
    private javax.swing.JButton Table9;
    private javax.swing.JLabel TableIcon;
    private javax.swing.JLabel Tables;
    private javax.swing.JPanel TablesPanel;
    private javax.swing.JLabel UName;
    private javax.swing.JLabel User;
    private javax.swing.JPanel UserPanel;
    private javax.swing.JLabel Waitlist;
    private javax.swing.JLabel WaitlistIcon;
    private javax.swing.JPanel WaitlistPanel;
    private javax.swing.JTable WaitlistTable;
    private javax.swing.JLabel dateLabel;
    private javax.swing.JLabel history;
    private javax.swing.JLabel jLabel1;
    private javax.swing.JLabel jLabel10;
    private javax.swing.JLabel jLabel11;
    private javax.swing.JLabel jLabel12;
    private javax.swing.JLabel jLabel13;
    private javax.swing.JLabel jLabel14;
    private javax.swing.JLabel jLabel15;
    private javax.swing.JLabel jLabel16;
    private javax.swing.JLabel jLabel17;
    private javax.swing.JLabel jLabel18;
    private javax.swing.JLabel jLabel19;
    private javax.swing.JLabel jLabel2;
    private javax.swing.JLabel jLabel20;
    private javax.swing.JLabel jLabel21;
    private javax.swing.JLabel jLabel22;
    private javax.swing.JLabel jLabel28;
    private javax.swing.JLabel jLabel29;
    private javax.swing.JLabel jLabel3;
    private javax.swing.JLabel jLabel30;
    private javax.swing.JLabel jLabel31;
    private javax.swing.JLabel jLabel32;
    private javax.swing.JLabel jLabel33;
    private javax.swing.JLabel jLabel34;
    private javax.swing.JLabel jLabel35;
    private javax.swing.JLabel jLabel36;
    private javax.swing.JLabel jLabel37;
    private javax.swing.JLabel jLabel38;
    private javax.swing.JLabel jLabel39;
    private javax.swing.JLabel jLabel4;
    private javax.swing.JLabel jLabel40;
    private javax.swing.JLabel jLabel42;
    private javax.swing.JLabel jLabel43;
    private javax.swing.JLabel jLabel44;
    private javax.swing.JLabel jLabel45;
    private javax.swing.JLabel jLabel46;
    private javax.swing.JLabel jLabel47;
    private javax.swing.JLabel jLabel48;
    private javax.swing.JLabel jLabel49;
    private javax.swing.JLabel jLabel5;
    private javax.swing.JLabel jLabel6;
    private javax.swing.JLabel jLabel7;
    private javax.swing.JLabel jLabel8;
    private javax.swing.JLabel jLabel9;
    private javax.swing.JPanel jPanel1;
    private javax.swing.JPanel jPanel10;
    private javax.swing.JPanel jPanel13;
    private javax.swing.JPanel jPanel17;
    private javax.swing.JPanel jPanel18;
    private javax.swing.JPanel jPanel19;
    private javax.swing.JPanel jPanel2;
    private javax.swing.JPanel jPanel20;
    private javax.swing.JPanel jPanel21;
    private javax.swing.JPanel jPanel22;
    private javax.swing.JPanel jPanel3;
    private javax.swing.JPanel jPanel4;
    private javax.swing.JPanel jPanel5;
    private javax.swing.JPanel jPanel6;
    private javax.swing.JPanel jPanel7;
    private javax.swing.JPanel jPanel8;
    private javax.swing.JScrollPane jScrollPane1;
    private javax.swing.JScrollPane jScrollPane2;
    private javax.swing.JScrollPane jScrollPane3;
    private javax.swing.JSeparator jSeparator1;
    private javax.swing.JLabel passWord;
    private javax.swing.JLabel search;
    private javax.swing.JLabel signOut;
    private javax.swing.JLabel signOut2;
    private javax.swing.JTabbedPane tabbedPane;
    public static final javax.swing.JLabel userName = new javax.swing.JLabel();
    public static final javax.swing.JLabel userName2 = new javax.swing.JLabel();
    private javax.swing.JTextField walkinsearch;
    // End of variables declaration//GEN-END:variables
}