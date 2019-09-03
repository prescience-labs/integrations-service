<?php

function main_review() {
    $config = new Config();

    $id = $_GET["id"];
    global $wpdb;
    $table_name = $wpdb->prefix . "reviews";


    if (isset($_POST['insert'])) {
        $name = $_POST["name"];
        $email = $_POST["email"];
        $rating = 0;
        if (isset($_POST['rating'])) {
            if (is_array($_POST['rating'])) {
                foreach ($_POST['rating'] as $value) {
                    $rating = $value;
                }
            } else {
                $rating = $_POST['rating'];
            }
        }
//        echo $rating;
//        die('check rating');
        $review = $_POST["review"];
        $wpdb->insert(
                $table_name, //table
                array('post_id' => $id, 'name' => $name,
            'email' => $email, 'rating' => $rating,
            'review' => $review) //data			
        );
        $message .= "Review inserted";
    }
    ?>
    <link href="<?php echo WP_PLUGIN_URL; ?>/review/css/bootstrap.min.css" rel="stylesheet">
    <link href="<?php echo WP_PLUGIN_URL; ?>/review/css/bootstrap.css" rel="stylesheet">
    <link href="<?php echo WP_PLUGIN_URL; ?>/review/css/fronted.css" rel="stylesheet">    
    <link rel="stylesheet" type="text/css" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.2/animate.min.css" rel="stylesheet" media="all"> 

    <div class="main_section">
        <div class="container">

            <?php
            //get product details by ID
            $products = $config->get_product_details($id);
            $reviews = $wpdb->get_results($wpdb->prepare("SELECT * from $table_name where post_id=%s and comment_status='1' and reply='0'", $id));
            ?>
            <div class="review_heading">
                <h2><?= sizeof($reviews) ?> Review for <?= $products->post_title ?></h2>
            </div>
            <?php
            foreach ($reviews as $s) {
                $rating = $s->rating;
                ?>
                <div class="review">
                    <div class="col-lg-1 pr">
                        <div class="review_image">
                            <img src="<?php echo WP_PLUGIN_URL; ?>/review/image/user.jpg" alt="">
                        </div>
                    </div>
                    <div class="col-lg-11 pl">
                        <div class="reviewss">
                            <div class="review_id">
                                <p><?= $s->name ?>-<?= date('dS F,Y', $s->comment_date) ?></p>
                                <div class="review_rating">
                                    <?php
                                    for ($index = 1; $index <= 5; $index++) {
                                        ?>
                                        <i class="fa fa-star<?= ($index <= $rating) ? ' checked' : '-o' ?>"></i>
                                        <?php
                                    }
                                    ?>

                                </div>
                                <div class="review_message">
                                    <p><?= $s->review ?></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <?php
            }
            ?>
            <form method="post" action="<?php echo $_SERVER['REQUEST_URI']; ?>">
                <div class="Add-review">
                    <h3>Add a review</h3>

                    <?php
                    if (is_user_logged_in()) {
                        $current_user = wp_get_current_user();
                        ?>
                        <input type="hidden" class="form-control" name="name" value="<?= $current_user->user_login ?>">
                        <input type="hidden" class="form-control"  name="email" value="<?= $current_user->user_email ?>">
                        <?php
                    } else {
                        ?>
                        <div class="user_review">
                            <label for="name">Name</label>
                            <input type="text" class="form-control" name="name" >
                        </div>
                        <div class="user_review">
                            <label for="email">Email</label>
                            <input type="email" class="form-control"  name="email">
                        </div> 
                        <?php
                    }
                    ?>
                    <p class="label_head">Your rating</p>
                    <div class="rating">
                        <input type="checkbox" id="star5" name="rating[]" value="5" /><label class = "full" for="star5" title="Awesome - 5 stars"></label>
                        <input type="checkbox" id="star4" name="rating[]" value="4" /><label class = "full" for="star4" title="Pretty good - 4 stars"></label>
                        <input type="checkbox" id="star3" name="rating[]" value="3" /><label class = "full" for="star3" title="Meh - 3 stars"></label>
                        <input type="checkbox" id="star2" name="rating[]" value="2" /><label class = "full" for="star2" title="Kinda bad - 2 stars"></label>
                        <input type="checkbox" id="star1" name="rating[]" value="1" /><label class = "full" for="star1" title="Sucks big time - 1 star"></label>
                    </div>
                </div>
                <input type="hidden" name="id" value="<?= $id ?>">
                <div class="user_review">
                    <div class="label_head">Your review*</div>
                    <textarea rows="4" cols="175" name="review">
                    </textarea> 
                    <button type="submit" name="insert">Submit</button> 
                </div>
            </form>


        </div>	
    </div>

    <?php
}
