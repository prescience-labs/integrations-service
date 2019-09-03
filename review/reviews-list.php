<?php

function reviews_list() {

    $config = new Config();
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
        <h2>Reviews</h2>
        <div class="tablenav top">
            <div class="alignleft actions">
                <a href="<?php echo admin_url('admin.php?page=reviews_create'); ?>">Add New</a> |
                <a href="<?php echo admin_url('admin.php?page=main_review&id=1'); ?>">Review template</a>
            </div>
            <br class="clear">
        </div>
        <?php
        global $wpdb;
        $table_name = $wpdb->prefix . "reviews";
        if (isset($_GET['comment_status'])) {
            $status = $_GET['comment_status'];
            if ($status != 'all')
                $table_name .= " where comment_status='" . $status . "'";
        }
        if (isset($_GET['change_status'])) {
            $status = ($_GET['change_status'] == 'approve') ? '1' : '0';
            $wpdb->get_results("update $table_name set comment_status='" . $status . "' where id=" . $_GET['id']);
        }

        $rows = $wpdb->get_results("SELECT * from $table_name order by id desc");
        ?>
        <div class="main_section">
            <div class="container">
                <div class="top_allreview">
                    <div class="top_listallreview col-md-6">
                        <ul>
                            <li><a href="admin.php?page=reviews_list&comment_status=all">All</a> <p>(<?= sizeof($rows) ?>)</p></li>
                            <li><a href="admin.php?page=reviews_list&comment_status=0">Pending</a> <p>(<?= $config->get_unapproved_counts() ?>)</p></li>
                            <li class="review_noborder"><a href="admin.php?page=reviews_list&comment_status=1">Approve</a> <p>(<?= $config->get_approved_counts() ?>)</p></li>

                                                                                                                                                                                                                                                                                                                                                                                                                                                    <!--    <li>Spam <p>(1)</p></li>
                                                                                                                                                                                                                                                                                                                                                                                                                                                            <li class="review_noborder">Trash <p>(1)</p></li>-->

                        </ul>
                    </div>

                </div>
                <div class="top_allreviewdrop">

                    <!-- <div class="item_review text-right col-md-6">
                             <p>1 item</p>
                    </div> -->

                </div>
                <table id="example" class="table table-striped table-bordered" style="width:100%">
                    <thead>
                        <tr>
                            <th>Customer</th>
                            <th>Review</th>
                            <th>Product</th>
                            <th>Submitted On</th>
                        </tr>
                    </thead>

                    <tbody>
                        <?php foreach ($rows as $row) { ?>
                            <tr>
                                <td><div class="review">
                                        <div class="col-lg-3 pr">
                                            <div class="review_image">
                                                <img src="<?php echo WP_PLUGIN_URL; ?>/review/image/user.jpg" alt="">
                                            </div>
                                        </div>
                                        <div class="col-lg-9 pl">
                                            <div class="reviewss">
                                                <div class="review_id">
                                                    <p><?php echo $row->name; ?></p>
                                                    <p><a href="mailto:<?= $row->email ?>"><?= $row->email ?></a></p>
                                                </div>
                                            </div>
                                        </div>
                                    </div></td>
                                <td>	
                                    <div class="review_id">
                                        <div class="review_rating">
                                            <?php
                                            for ($index = 1; $index <= 5; $index++) {
                                                ?>
                                                <i class="fa fa-star<?= ($index <= $row->rating) ? ' checked' : '-o' ?>"></i>
                                                <?php
                                            }
                                            ?>
                                        </div>
                                        <div class="review_message">
                                            <p><?php echo $row->review; ?></p>
                                        </div>
                                        <a href="admin.php?page=reviews_list&change_status=<?= ($row->comment_status == '0') ? 'approve' : 'unapprove'; ?>&id=<?= $row->id ?>">
                                            <?= ($row->comment_status == '0') ? 'Approve' : 'Unapprove'; ?>
                                        </a> |
                                        <a href="#" onclick="showDiv(<?= $row->id ?>);" id="attach_box<?= $row->id ?>">Reply</a> |
                                        <a href="<?php echo admin_url('admin.php?page=reviews_update&id=' . $row->id); ?>">Update</a>
                                    </div>
                                </td>
                                <?php
                                $product = $config->get_product_details($row->post_id);
                                ?>
                                <td>
                                    <div class="tables_rev">
                                        <p><?= $product->post_title ?></p>
                                        <p><a href="<?= $product->guid ?>" target="_blank">view product</a></p>
                                    </div>
                                </td>
                                <td><div class="tables_rev"><p><?php echo $row->comment_date; ?><p></div></td>

                            </tr>

                        <?php } ?>

                    </tbody>

                    <tfoot>
                        <tr>
                            <th>Customer</th>
                            <th>Review</th>
                            <th>Product</th>
                            <th>Submitted On</th>
                        </tr>
                    </tfoot>

                </table>
                <div id="response"></div>
                <?php
                foreach ($rows as $row) {
                    if (is_user_logged_in()) {
                        $current_user = wp_get_current_user();
                        ?>
                        <div id="sec_box<?= $row->id ?>" style="display: none;" class="div_show">
                            <textarea name="review" id="review<?= $row->id ?>"></textarea>     
                            <input type='submit' name="reply" value='Reply' class='button' onclick="addReply(<?= $row->id ?>,<?= $current_user->ID ?>,<?= $row->post_id ?>)">
                        </div>
                        <?php
                    } else {
                        echo 'Please login first !';
                    }
                }
                ?>
            </div>	
        </div>

    </div>

    <script type="text/javascript">
        function addReply(replyTo, replyBy, productId) {
            console.log('RepltTo:' + replyTo);
            console.log('replyBy:' + replyBy);
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    // Typical action to be performed when the document is ready:
                    document.getElementById("response").innerHTML = xhttp.responseText;
                }
            };
            xhttp.open("POST", "admin.php?action=reply&replyTo=" + replyTo + "&replyBy=" + replyBy + "&product=" + productId, true);
            xhttp.send();
        }
        function showDiv(id) {
            $('.div_show').hide();
            $('#response').html('');
            $('#sec_box' + id).show();
            return false;
        }
    </script>

    <script src="<?php echo WP_PLUGIN_URL; ?>/review/js/bootstrap.min.js"></script>
    <script src="<?php echo WP_PLUGIN_URL; ?>/review/js/bootstrap.js"></script>

    <script type="text/javascript" src="https://code.jquery.com/jquery-3.3.1.js"></script>
    <script type="text/javascript" src="https://cdn.datatables.net/1.10.19/js/jquery.dataTables.min.js"></script>
    <script type="text/javascript" src="https://cdn.datatables.net/1.10.19/js/dataTables.bootstrap.min.js"></script>
    <script type="text/javascript">
        $(document).ready(function () {
            $('#example').DataTable();
        });
    </script>
    <?php
}
