<?php

/**
 * Provide a admin area view for the plugin
 *
 * This file is used to markup the admin-facing aspects of the plugin.
 *
 * @link       https://iferch.com
 * @since      1.0.0
 *
 * @package    iFerch_Plugin
 * @subpackage iFerch_Plugin/admin/partials
 */
?>

<!-- This file should primarily consist of HTML with a little bit of PHP. -->



<?php
$apikey = get_option('iferch_apikey');
$serviceId = get_option('iferch_serviceId');

if (!$apikey or !$serviceId) {
    $prevent = true;
}

?>
<div class="iferch-header-box">
    <img class="iferch-logo" src="https://www.iferch.com/assets/img/1024x1024.png" alt="iferch logo">
    <h6> <i class="fa fa-clock-o text-success"></i> Delivery History</h6>
</div>
<div style="display: flex; justify-content: flex-end; margin-right: 50px; gap: 10px">
    <div class="iferch-message-box" id="iferch-message-box">
        Show error message
    </div>
    <img id="iferch-ajax-loader" class="iferch-hide-loader" src="<?= plugins_url() . '/iferch_wp_plugin/admin/img/ajax-loader.gif' ?>" alt="loading..." />
</div>

<?php if ($prevent) { ?>
    <div class="container">
        <div class="row">
            <div class="col-md-12">
                <div class="card bg-danger">
                    <span class="text-light">Please obtain API key from iFerch to use our service</span>
                </div>
            </div>
        </div>
    </div>
<?php } else { ?>
    <span id="iferch-history"></span>
    <div class="container">
        <input type="hidden" name="eeee" id="iferch_serviceId" value="<?= $serviceId ?>">
        <input type="hidden" name="dddd" id="iferch_apikey" value="<?= $apikey ?>">
        <div class="table-responsive">
            <table class="table table-striped paginated">
                <thead>
                    <tr>
                        <th scope="col">Booking No.</th>
                        <th scope="col">Request Date</th>
                        <th scope="col">Booking Type</th>
                        <th scope="col">Pickup</th>
                        <th scope="col">Drop Off </th>
                        <th scope="col">Fare </th>
                        <th scope="col">Status </th>
                    </tr>
                </thead>
                <tbody id="history-table-body">
                    <tr>
                        <td scope="row" class="text-center" colspan="7">loading...</td>
                    </tr>
                </tbody>
            </table>
            <div id="page-nav"></div>
        </div>
    </div>
<?php } ?>