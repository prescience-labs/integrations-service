<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of Config
 *
 * @author Rajinder
 */
class Config {

    function getWPDB() {
        global $wpdb;
        return $wpdb;
    }

//get product by ID
    function get_product_details($post_id) {
        $wpdb = $this->getWPDB();
        $product_table_name = $wpdb->prefix . "posts";
        $result = $wpdb->get_row("select * from $product_table_name where ID=" . $post_id);
        return $result;
    }

//get approved counts
    function get_approved_counts() {
        $wpdb = $this->getWPDB();
        $table_name = $wpdb->prefix . "reviews";
        $result = $wpdb->get_var("select count(*) from $table_name where comment_status='1'");
        echo $result;
    }

//get unapproved counts
    function get_unapproved_counts() {
        $wpdb = $this->getWPDB();
        $table_name = $wpdb->prefix . "reviews";
        $result = $wpdb->get_var("select count(*) from $table_name where comment_status='0'");
        echo $result;
    }

}
