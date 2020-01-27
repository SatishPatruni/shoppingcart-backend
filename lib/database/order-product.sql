CREATE TABLE shoppingcart.order_product (
	id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
	order_id INT(10) UNSIGNED NOT NULL,
	product_id INT(10) UNSIGNED NOT NULL,
	count INT(10) UNSIGNED DEFAULT 1 NOT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT order_product_pk PRIMARY KEY (id),
	CONSTRAINT order_product_order_fk FOREIGN KEY (order_id) REFERENCES shoppingcart.`order`(id),
	CONSTRAINT order_product_product_fk FOREIGN KEY (product_id) REFERENCES shoppingcart.product(id)
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8;
