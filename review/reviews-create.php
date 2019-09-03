<?php

function reviews_create() {
    $id = $_POST["post_id"];
    $name = $_POST["name"];
    $email = $_POST["email"];
    $rating = $_POST["rating"];
    $review = $_POST["review"];

    //insert

    if (isset($_POST['insert'])) {
        global $wpdb;
        $table_name = $wpdb->prefix . "reviews";

        //echo $table_name;
        //die('check');

        $wpdb->insert(
                $table_name, //table
                array('post_id' => $id, 'name' => $name,
            'email' => $email, 'rating' => $rating,
            'review' => $review) //data
                // array('%i','%s', '%s','%i', '%s') //data format			
        );
        $message .= "Review inserted";
    }
    ?>
    <link href="<?php echo WP_PLUGIN_URL; ?>/review/css/bootstrap.min.css" rel="stylesheet">
    <link href="<?php echo WP_PLUGIN_URL; ?>/review/css/bootstrap.css" rel="stylesheet">
    <link rel="stylesheet" type="text/css" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.2/animate.min.css" rel="stylesheet" media="all">
    <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/1.10.19/css/dataTables.bootstrap.min.css">

    <script src="https://code.jquery.com/jquery-1.10.2.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <link type="text/css" href="<?php echo WP_PLUGIN_URL; ?>/review/css/style-admin.css" rel="stylesheet" />

    <div class="wrap">

        <div class="main_section">
            <div class="container">

                <div class="add-review">
                    <p>  <h2>Add New Review</h2></p>
                </div>
                <div class="reviews_one">
                    <div class="add-reviewss">
                        <?php if (isset($message)): ?><div class="updated"><p><?php echo $message; ?></p></div><?php endif; ?>
                        <form method="post" action="<?php echo $_SERVER['REQUEST_URI']; ?>">
                            <div class="form-group">
                                <label for="id">Product ID</label>
                                <div class="form-review">
                                    <input type="text" class="form-control"  name="post_id" value="<?php echo $id; ?>">
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="name">Name</label>
                                <div class="form-review">
                                    <input type="text" class="form-control" id="pwd" name="name" value="<?php echo $name; ?>" >
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="email">Email</label>
                                <div class="form-review">
                                    <input type="email" class="form-control" id="pwd" name="email" value="<?php echo $email; ?>">
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="Review">Review</label>
                                <div class="form-review">
                                    <input type="text" class="form-control" id="pwd" name="review" value="<?php echo $review; ?>">
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="Rating">Rating</label>
                                <div class="form-review">
                                    <input type="number" name="rating" value="<?php echo $rating; ?>" class="form-control" id="pwd">
                                </div>
                            </div>

                            <button type="submit" name="insert" class="btn btn-default">Submit</button>
                        </form> 
                    </div>
                </div>

            </div>	
        </div>

    </div>

    <script src="<?php echo WP_PLUGIN_URL; ?>/review/js/bootstrap.min.js"></script>
    <script src="<?php echo WP_PLUGIN_URL; ?>/review/js/bootstrap.js"></script>

    <script type="text/javascript" src="https://code.jquery.com/jquery-3.3.1.js"></script>
    <script type="text/javascript" src="https://cdn.datatables.net/1.10.19/js/jquery.dataTables.min.js"></script>
    <script type="text/javascript" src="https://cdn.datatables.net/1.10.19/js/dataTables.bootstrap.min.js"></script>
    <?php
}
