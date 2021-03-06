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
    <h6> <i class="fa fa-rss text-success"></i> Single Delivery</h6>
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
<?php }else{ ?>
    <span id="iferch-single"></span>
<?php }?>

<div class="container">
    <div class="row">
        <div class="col-md-6">
            <div class="card">
                <div class="row0">
                    <p>Delivery Options: </p>
                    <select <?php if ($prevent) echo "disabled" ?> class="iferch-form-control col-md-12" name="packagetype" id="iferch-packagetype">
                        <option value="0">Select package type</option>
                    </select>
                    <input type="hidden" id="iferch_apikey" value="<?= $apikey ?>">
                    <input type="hidden" id="iferch_serviceId" value="<?= $serviceId ?>">
                    <input type="text" class="form-control col-md-12 mt-3 mb-3" name="receipentname" id="iferch-recipient-name" placeholder="Recipient Name">
                    <input name="recipient-phone" type="text" class="form-control  col-md-12 w-100" id="iferch-single-phone-recipient" placeholder="Recipient Mobile" />
                    <div class="mt-3"></div>
                    <input name="pickup-phone" type="text" class="form-control  col-md-12 w-100" id="iferch-single-phone-pickup" placeholder="Pickup Mobile" />
                    <input name="pickup" type="text" class="form-control  col-md-12 w-100 mt-3" id="iferch-pickup-message" placeholder="Pickup Message" />
                    <input name="delivery" type="text" class="form-control  col-md-12 w-100 mt-3" id="iferch-delivery-message" placeholder="Delivery Message" />
                    <input name="package" type="text" class="form-control  col-md-12 w-100 mt-3 mb-3" id="iferch-package-details" placeholder="Package Details" />
                    <p class="m-0">Pickup Time:</p>
                    <input id="iferch-datetimepicker" type="text" class="form-control  filter-by-text">
                    <br>
                    <small class="text-danger" id="iferch-invalid-time"></small>
                </div>
            </div>
        </div>
        <div class="col-md-6">
            <div class="card">
                <p>Location Details: </p>
                <select <?php if ($prevent) echo "disabled" ?> class="iferch-form-control col-md-12" name="vehicletype" id="iferch-vehicletype">
                    <option value="0">Select vehicle type</option>
                </select>
                <div style="position: relative">
                  <input <?php if ($prevent) echo "readonly" ?> id="iferch-myInput" class="form-control mt-3" type="text" name="myCountry" placeholder="search pickup location">
                </div>
                <div style="position: relative">
                <input <?php if ($prevent) echo "readonly" ?> id="iferch-myInput2" class="form-control mt-3" type="text" name="myCountry" placeholder="search drop off location">
                </div>
                <div style="height: 20px"></div>
                <p class="iferch-no-margin iferch-bold">Fare Estimate:</p>
                <hr class="iferch-rule">
                <ul class="iferch-ul" id="iferch-ul">
                </ul>
                <div style="display: flex; justify-content: flex-end; margin-top: 20px">
                    <button class="btn btn-primary" id="iferch-make-single-delivery">Submit</button>
                </div>
            </div>
        </div>
    </div>
</div>