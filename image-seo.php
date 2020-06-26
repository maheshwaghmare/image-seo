<?php
/**
 * Plugin Name: Image SEO
 * Description: Highlights the missing or empty alt and caption from the post, pages and custom post type images in a single place. Additionally, It checks the missing SEO focus keywords from the image alt tag.
 * Plugin URI: https://maheshwaghmare.com/doc/image-seo/
 * Author: Mahesh M. Waghmare
 * Author URI: https://maheshwaghmare.com/
 * Version: 1.0.0
 * License: GPL2
 * Text Domain: image-seo
 *
 * @package Image SEO
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Set constants.
define( 'IMAGE_SEO_VER', '1.0.0' );
define( 'IMAGE_SEO_FILE', __FILE__ );
define( 'IMAGE_SEO_BASE', plugin_basename( IMAGE_SEO_FILE ) );
define( 'IMAGE_SEO_DIR', plugin_dir_path( IMAGE_SEO_FILE ) );
define( 'IMAGE_SEO_URI', plugins_url( '/', IMAGE_SEO_FILE ) );

require_once IMAGE_SEO_DIR . 'src/init.php';