CREATE TABLE shoppingcart.`order` (
	id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
	payment_provider_id varchar(255) NULL,
	user_id INT(10) UNSIGNED NOT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at TIMESTAMP NOT NULL,
	status ENUM('open','close') DEFAULT 'open' NOT NULL,
	CONSTRAINT order_pk PRIMARY KEY (id),
	CONSTRAINT order_user_fk FOREIGN KEY (user_id) REFERENCES shoppingcart.`user`(user_id)
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8;

ALTER TABLE shoppingcart.`order` MODIFY COLUMN status enum('open','closed') CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT 'open' NOT NULL;
