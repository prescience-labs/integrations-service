<?php

/**
 * Plugin Name:Review for WooCommerce
 * Plugin URI: https://www.yourwebsiteurl.com/
 * Description: This is the my first plugin review I ever created.
 * Version: 1.0
 * Author: Rajinder
 * Author URI: http://netzens.com/
 * */
/**
 * Define some useful constants
 * */
define('REVIEW_VERSION', '1.0');
define('REVIEW_DIR', plugin_dir_path(__FILE__));
define('REVIEW_URL', plugin_dir_url(__FILE__));

/**
 * Load files
 * 
 * */
function review_load() {

    if (is_admin()) //load admin files only in admin
        require_once(REVIEW_DIR . 'includes/admin.php');

    require_once(REVIEW_DIR . 'includes/core.php');
}

review_load();

/**
 * Activation, Deactivation and Uninstall Functions
 * 
 * */
register_activation_hook(__FILE__, 'review_activation');
register_deactivation_hook(__FILE__, 'review_deactivation');

function review_activation() {

    //actions to perform once on plugin activation go here  
    if (class_exists('WooCommerce')) {
        global $wpdb;
        $table_name = $wpdb->prefix . "reviews";
        $charset_collate = $wpdb->get_charset_collate();
        $sql = "CREATE TABLE $table_name (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            post_id bigint(20) UNSIGNED,
            name tinytext NOT NULL,
            email tinytext NOT NULL,
            review text NOT NULL,
            rating int(11) NOT NULL,
            comment_date datetime DEFAULT CURRENT_TIMESTAMP NOT NULL,
            comment_status  enum('1','0') default '0',
            reply enum('1','0') default '0',
            PRIMARY KEY (id),
            FOREIGN KEY (post_id) REFERENCES " . $wpdb->prefix . "posts(ID)
            ) $charset_collate; ";

//    echo $sql;
//    die('check');

        require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
        dbDelta($sql);
    } else {
        echo 'Please install first Woocommerce plugin';
        exit();
    }

    //register uninstaller

    register_uninstall_hook(__FILE__, 'review_uninstall');
}

function review_deactivation() {

    // actions to perform once on plugin deactivation go here

    global $wpdb;
    $table_name = $wpdb->prefix . "reviews";
    $sql = "drop TABLE $table_name;";

//    echo $sql;
//    die('check');

    require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
    dbDelta($sql
    );
}

function review_uninstall() {

    //actions to perform once on plugin uninstall go here
}

//menu items
add_action('admin_menu', 'reviews_modifymenu');

function reviews_modifymenu() {

    //this is the main item for the menu
    add_menu_page('Reviews', //page title
            'Reviews', //menu title
            'manage_options', //capabilities
            'reviews_list', //menu slug
            'reviews_list', //function
            WP_PLUGIN_URL . '/review/image/star.png' //menu icon 
    );

    //this is a submenu

    add_submenu_page('reviews_list', //parent slug
            'Add New Review', //page title
            'Add New', //menu title
            'manage_options', //capability
            'reviews_create', //menu slug
            'reviews_create'); //function
    //this submenu is HIDDEN, however, we need to add it anyways

    add_submenu_page(null, //parent slug
            'Update Review', //page title
            'Update', //menu title
            'manage_options', //capability
            'reviews_update', //menu slug
            'reviews_update'); //function

    add_submenu_page(null, //parent slug
            'Review Template', //page title
            'Review Template', //menu title
            'manage_options', //capability
            'main_review', //menu slug
            'main_review');
}

define('ROOTDIR', plugin_dir_path(__FILE__));
require_once(ROOTDIR . 'fronted/main-review.php');
require_once(ROOTDIR . 'reviews-list.php');
require_once(ROOTDIR . 'reviews-create.php');
require_once(ROOTDIR . 'reviews-update.php');
require_once(ROOTDIR . 'includes/Config.php');

add_shortcode('get_review_list', $main_review);
?>
