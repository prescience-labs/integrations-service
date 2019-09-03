<?php
session_start();
/**
 * Admin functions MSP review plugin
 * */
global $wpdb;
$table_name = $wpdb->prefix . "reviews";

if (isset($_REQUEST['action'])) {
    if ($_REQUEST['action'] = 'reply') {
        $post_id = $_REQUEST['product'];
        $review = $_REQUEST['product'];
        if (is_user_logged_in()) {
            $current_user = wp_get_current_user();
            $name = $current_user->user_login;
            $email = $current_user->user_email;
        }
        $result = $wpdb->insert($table_name, array('post_id' => $post_id, 'name' => $name,
            'email' => $email, 'review' => $review,
            'reply' => '1')); //data
        $id = $wpdb->insert_id;
        if ($id > 0) {
            echo 'Reply submitted !';
        } else {
            echo 'Error!';
        }
    }
}
?>