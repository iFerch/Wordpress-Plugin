<?php

/**
 * Provide a admin area view for the plugin
 *
 * This file is used to markup the admin-facing aspects of the plugin.
 *
 * @link       https://www.iferch.com
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
    <h6> <i class="fa fa-leaf text-success"></i> Multi-Delivery</h6>
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
    <span id="iferch-multi"></span>
    <div class="container">
        <input type="hidden" id="iferch_apikey" value="<?= $apikey ?>">
        <input type="hidden" id="iferch_serviceId" value="<?= $serviceId ?>">
        <div class="row">
            <div class="col-md-6">
                <div class="card">
                    <p>Delivery Details: </p>
                    <div style="position: relative;">
                    <input <?php if ($prevent) echo "readonly" ?> id="iferch-myInput" class="form-control" type="text" name="myCountry" placeholder="search pickup location">
                    </div>
                    <select <?php if ($prevent) echo "disabled" ?> class="iferch-form-control col-md-12 mt-3" name="vehicletype" id="iferch-vehicletype">
                        <option value="0">Select vehicle type</option>
                    </select>
                    <!-- <div style="display: flex; justify-content: flex-end; margin-top: 20px">
                        <button type="button" class="btn btn-success" id="open-iferch-multi-modal">Add drop off details</button>
                    </div> -->
                    <div class="mt-4">
                        <p class="m-0">Pickup Time:</p>
                        <input id="iferch-datetimepicker" type="text" class="form-control  filter-by-text">
                        <br>
                        <small class="text-danger" id="iferch-invalid-time"></small>
                    </div>
                    <div id="payment-box-2" class="mt-4">
                        <p>Payment Mode: </p>
                        <div class="row">
                            <div class="col-md-4">
                                <input type="radio" name="payment-mode" id="paybysender" checked onchange="onSender()">
                                <label for="paybysender" class="ferch-label">By Sender (Me)</label>
                            </div>
                            <div class="col-md-4">
                                <input type="radio" name="payment-mode" id="paybyreceiver" onchange="onReceiver()">
                                <label for="paybyreceiver" class="ferch-label">By One Receiver</label>
                                <div id="iferch-receiver-box" class="row" style="margin-left: 1px;">
                                </div>
                            </div>
                            <div class="col-md-4">
                                <input type="radio" name="payment-mode" id="paybyeachreceiver" onchange="onIndividual()">
                                <label for="paybyeachreceiver" class="ferch-label">By Each Recipient</label>
                                <div id="iferch-show-only-when">
                                    <label class="ferch-label">Each recipient pays: GH¢ <span id="iferch-amt">0.00</span> </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style="display: flex; justify-content: flex-end; margin-top: 20px">
                        <button class="btn btn-primary"  id="multi-form-submit" onclick="makeMultiDelivery()">Submit</button>
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="card">
                    <!-- <p>Preview: </p> -->
                <div style="display: flex; justify-content: flex-end;">
                        <button type="button" class="iferch-add-drop-off-btn" id="open-iferch-multi-modal">Add drop off details</button>
                    </div>
                    <div class="iferch-drop-off">
                        <ul class="iferch-no-margin iferch-no-padding" id="iferch-drop-off">
                        </ul>
                    </div>
                    <div style="height: 20px"></div>
                    <p class="iferch-no-margin iferch-bold">Fare Estimate:</p>
                    <hr class="iferch-rule">
                    <ul class="iferch-ul" id="iferch-ul">
                    </ul>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="iferch-multi-myModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <form class="modal-content" id="iferch-multi-form" method="POST">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Drop off details:</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close" id="iferch-close-tbn">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-md-2"></div>
                        <div class="col-md-8" id="iferch-multi-modal-body">
                        </div>
                        <div class="col-md-2"></div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal" id="iferch-multi-close-btn">Close</button>
                    <button type="submit" class="btn btn-primary" id="iferch-multi-save-btn">Save</button>
                </div>
            </form>
        </div>
    </div>
<?php } ?>