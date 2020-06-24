//  Import CSS.
import './editor.scss';
import './style.scss';

import { Fragment } from '@wordpress/element';

import { registerPlugin } from '@wordpress/plugins';
import { openGeneralSidebar, PluginSidebar } from '@wordpress/edit-post';
import { getBlocks } from '@wordpress/edit-post';
import { select, useDispatch, withSelect } from '@wordpress/data';
import { TextControl, TextareaControl, ExternalLink } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { PanelBody } from '@wordpress/components';
import { last, countBy, isEmpty } from 'lodash';
import { sprintf, _n } from '@wordpress/i18n';

const FocusKeywrods = ( props ) => {
	let { SEOPluginName, focusKeywordItems, haveAnyFocusKeywords } = props;

	if( 'no' === ImageSEOVars.isRankMathActive && 'no' === ImageSEOVars.isYoastActive ) {
		return ''
	}

	// Not have any focus keywords.
	if( false === haveAnyFocusKeywords ) {
		return ''
	}

	return (
		<div className="image-seo-seo-keywords">

			<div className="image-seo-section-heading">
				{ sprintf( __( 'Focus Keywords (%s)', 'image-seo' ), SEOPluginName ) }
	    	</div>

	    	<ol className="seo-ready-images-keywords">
	    		{focusKeywordItems}
			</ol>
		</div>
	)
}

/**
 * List Images
 */
const ListOfImages = ( props ) => {
	let { items } = props;

	return (
		<div className="image-seo-list-of-images">
			<div className="image-seo-section-heading">
				{ __( 'List of all images', 'image-seo' ) }
			</div>
	        <div className="seo-ready-images-list">
	        	{ items }
	        </div>
		</div>
	)
}

/**
 * Summery
 */
const Summery = ( props ) => {
	let { allImagesCount, missingAltClass, missingCaptionClass, missingAltText, missingCaptionText} = props;
	return (
		<div className="image-seo-images-summery">
			<p>
				<b>{ __( 'Total', 'image-seo' ) }: </b>
					{ sprintf( _n( '%d image found.', '%d images found.', allImagesCount, 'image-seo' ), allImagesCount ) }
			</p>
			<ul className="image-seo-categories-list">
				<li>
					<b>{ __( 'Alt:', 'image-seo' ) } </b><span className={missingAltClass}>{missingAltText}</span>
				</li>
				<li>
					<b>{ __( 'Caption:', 'image-seo' ) } </b><span className={missingCaptionClass}>{missingCaptionText}</span>
				</li>
			</ul>
		</div>
	)
}

// Images Summery.
const ImageSummery = ( props ) => {
	let { count } = props;

	// No images then return.
	if( ! count ) {
		return (
			<Fragment>
				<p className="no-images-found">
					{ __( 'No images found.', 'image-seo' ) }
				</p>
				<p>
				{ __( 'Read more the' ) }{ ' ' }
				<ExternalLink href="https://maheshwaghmare.com/doc/image-seo/">
					{ __( 'importance of images' ) }
				</ExternalLink>
				</p>
			</Fragment>
		)
	}

	let focusKeywords = []
	let haveAnyFocusKeywords = false
	let SEOPluginName = ''

	const allBlocks = select( 'core/block-editor' ).getBlocks();
	const imageBlocks = allBlocks.filter( ( block ) => 'core/image' === block.name );

	if( 'yes' === ImageSEOVars.isRankMathActive ) {
		SEOPluginName = 'Rankmath';
		focusKeywords = select( 'core/editor' ).getEditedPostAttribute( 'meta' )['rank_math_focus_keyword']
	} else if( 'yes' === ImageSEOVars.isYoastActive ) {
		SEOPluginName = 'Yoast';
		focusKeywords = select( 'core/editor' ).getEditedPostAttribute( 'meta' )['_yoast_wpseo_focuskw' ]
	}

	let focusKeywordItems = ''
	if( ! isEmpty( focusKeywords ) ) {
		haveAnyFocusKeywords = true;
		focusKeywords = focusKeywords.split(',');

		focusKeywordItems = focusKeywords.map( ( keyword ) => {

			// Count the focus keywords.
			let keyword_count = 0
			imageBlocks.map( ( block, index ) => {
				let alt = block.attributes.alt;
				let tmpcount = alt.split( keyword ).length - 1 || 0
			    keyword_count = keyword_count + tmpcount
			})
			
			return <li>{keyword} <i>({keyword_count})</i></li>
        })
	}

	const { updateBlockAttributes } = useDispatch( 'core/block-editor' );
	let missingAltCount = 0;
	let missingCaptionCount = 0;
	let allImagesCount = imageBlocks.length || 0;

	imageBlocks.forEach( ( value, id ) => {
		if( ! value.attributes.alt ) {
			missingAltCount++;
		}
		if( ! value.attributes.caption ) {
			missingCaptionCount++;
		}
	} )

	let items = imageBlocks.map( ( block, index ) => {
					let image_url = block.attributes.url || '';

					if( ! image_url ) {
						return
					}

					let name = last( image_url.split( '/' ) );
					let alt = block.attributes.alt;
					let caption = block.attributes.caption;
					let status = '';
					let count = 0
					let usedKeywords = []

					if( isEmpty( alt )) {
						status = 'panel-fail';
					} else {
						if( isEmpty( alt ) ) {
							status = 'panel-average'
						} else {
							status = 'panel-success'
						}
						if( haveAnyFocusKeywords && focusKeywords ) {
							focusKeywords.map( ( keyword ) => {
								let tmpcount = alt.split( keyword ).length - 1 || 0
							    count = count + tmpcount
							    if( tmpcount ) {
							    	usedKeywords.push( keyword )
							    }
							})

							// Set the success or average depends on the focus keyword count.
							status = count ? 'panel-success' : 'panel-average';
						}
					}

	            	name = name || image_url;

	            	return (
	            		<PanelBody
	            			initialOpen={ false }
	            			className={status}
	            			title={ `${index + 1}) ${name}` }>
								<img src={image_url} />

		            			<p>
			            			<label class="components-base-control__label">{ __( 'Caption' ) }</label>
			            			<textarea
			            				class="components-textarea-control__input"
			            				rows="1"
										onChange={ ( event ) => (
			            					updateBlockAttributes( block.clientId, {
												caption: event.target.value,
											} ) )
				            			}
									>{caption}</textarea>
								</p>

								<p>
									<label class="components-base-control__label">{ __( 'Alt text (alternative text)' ) }</label>
			            			<textarea
			            				class="components-textarea-control__input"
			            				rows="4"
										onChange={ ( event ) => (
			            					updateBlockAttributes( block.clientId, {
												alt: event.target.value,
											} ) )
				            			}
									>{alt}</textarea>
									{ isEmpty( usedKeywords ) && ( 'yes' === ImageSEOVars.isRankMathActive || 'yes' === ImageSEOVars.isYoastActive ) ? __( 'No focus keyword.', 'image-seo') : sprintf( __( 'Used keywords: %s', 'image-seo'), usedKeywords.join(',') ) }
								</p>
						</PanelBody>
            		)
		        })

	let missingCaptionText = ( missingCaptionCount ) ? sprintf( _n( 'Missing from %d image.', 'Missing from %d images.', missingCaptionCount, 'image-seo' ), missingCaptionCount ) : __( 'All Good.' )
	let missingCaptionClass = ( missingCaptionCount ) ? 'average' : 'success';

	let missingAltText = ( missingAltCount ) ? sprintf( _n( 'Missing from %d image.', 'Missing from %d images.', missingAltCount, 'image-seo' ), missingAltCount ) : __( 'All Good.', 'image-seo' )
	let missingAltClass = ( missingAltCount ) ? 'fail' : 'success';

	return (
		<div>

			<Summery allImagesCount={allImagesCount} missingAltClass={missingAltClass} missingCaptionClass={missingCaptionClass} missingAltText={missingAltText} missingCaptionText={missingCaptionText}/>

			<FocusKeywrods SEOPluginName={SEOPluginName} focusKeywordItems={focusKeywordItems} haveAnyFocusKeywords={haveAnyFocusKeywords} />

			<ListOfImages items={items} />
		</div>
	)
}

const ImageSEO = ( props ) => {

	const allBlocks = select( 'core/block-editor' ).getBlocks();

	const imageBlocks = allBlocks.filter( ( block ) => 'core/image' === block.name );

	let allImagesCount = imageBlocks.length || 0;

	return (
        <PluginSidebar
            name="image-seo"
            title={ __( 'Image SEO', 'image-seo' ) }
        >
        	<div className="seo-ready-images-summery">

        		<ImageSummery count={allImagesCount} />

	        </div>
        </PluginSidebar>
    );
};

/**
 * Add blocks
 */
export default withSelect( ( select, { rootClientId } ) => {
	return {
		blocks: select( 'core/block-editor' ).getBlocks(),
	};
} )( ImageSEO );

/**
 * Register Plugin
 */
registerPlugin( 'image-seo', {
	render: ImageSEO,
	icon: (
		<span className="image-seo-icon-wrapper">
			<span className="dashicons dashicons-format-image"></span>
			<span className="image-seo-icon-title">{ __( 'SEO', 'image-seo' ) }</span>
		</span>
	),
} );
