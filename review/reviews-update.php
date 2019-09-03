<?php

function reviews_update() {
    global $wpdb;
    $table_name = $wpdb->prefix . "reviews";
    $id = $_GET["id"];
    $postId = $_POST["post_id"];
    $name = $_POST["name"];
    $email = $_POST["email"];
    $rating = $_POST["rating"];
    $review = $_POST["review"];
    
//update
    
    if (isset($_POST['update'])) {
        $wpdb->update(
                $table_name, //table
                array('post_id' => $postId, 'name' => $name, 'email' => $email, 'rating' => $rating, 'review' => $review), //data
                array('ID' => $id) //where
        );
    } else if (isset($_POST['delete'])) { //delete
        $wpdb->query($wpdb->prepare("DELETE FROM $table_name WHERE id = %s", $id));
    } else {//selecting value to update	
        $reviews = $wpdb->get_results($wpdb->prepare("SELECT * from $table_name where id=%s", $id));
        foreach ($reviews as $s) {
            $name = $s->name;
            $post_id = $s->post_id;
            $email = $s->email;
            $rating = $s->rating;
            $review = $s->review;
        }
    }
    ?>
    <link type="text/css" href="<?php echo WP_PLUGIN_URL; ?>/review/css/style-admin.css" rel="stylesheet" />
    <div class="wrap">
        <h2>Reviews</h2>

        <?php if ($_POST['delete']) { ?>
            <div class="updated"><p>Review deleted</p></div>
            <a href="<?php echo admin_url('admin.php?page=reviews_list') ?>">&laquo; Back to reviews list</a>

        <?php } else if ($_POST['update']) { ?>
            <div class="updated"><p>Review updated</p></div>
            <a href="<?php echo admin_url('admin.php?page=reviews_list') ?>">&laquo; Back to reviews list</a>

        <?php } else { ?>
            <form method="post" action="<?php echo $_SERVER['REQUEST_URI']; ?>">
            <!--<p>Three for the Product ID</p>-->
                <table class='wp-list-table widefat fixed'>
                    <tr>
                        <th class="ss-th-width">Product ID</th>
                        <td><input type="text" name="post_id" value="<?php echo $post_id; ?>" class="ss-field-width" /></td>
                    </tr>
                    <tr>
                        <th class="ss-th-width">Name</th>
                        <td><input type="text" name="name" value="<?php echo $name; ?>" class="ss-field-width" /></td>
                    </tr>
                    <tr>
                        <th class="ss-th-width">Email</th>
                        <td><input type="text" name="email" value="<?php echo $email; ?>" class="ss-field-width" /></td>
                    </tr>
                    <tr>
                        <th class="ss-th-width">Review</th>
                        <td><input type="text" name="review" value="<?php echo $review; ?>" class="ss-field-width" /></td>
                    </tr>
                    <tr>
                        <th class="ss-th-width">Rating</th>
                    <div class="container">
                        <span id="rateMe1"></span>
                    </div>

                    <!-- rating.js file -->
                    
                    <script >
                        $(document).ready(function () {
                            $('#rateMe1').mdbRate();
                        });
                    </script>
                    <td><input type="number" name="rating" value="<?php echo $rating; ?>" class="ss-field-width" /></td>
                    </tr>

                </table>
                <input type='submit' name="update" value='Save' class='button'> &nbsp;&nbsp;
                <input type='submit' name="delete" value='Delete' class='button' onclick="return confirm('Confirm to delete?')">

            </form>
        <?php } ?>

    </div>
    <?php
}
