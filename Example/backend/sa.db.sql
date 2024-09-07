BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "genders" (
	"id"	integer,
	"created_at"	datetime,
	"updated_at"	datetime,
	"deleted_at"	datetime,
	"name"	text,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "users" (
	"id"	integer,
	"created_at"	datetime,
	"updated_at"	datetime,
	"deleted_at"	datetime,
	"first_name"	text,
	"last_name"	text,
	"email"	text,
	"password"	text,
	"birth_day"	datetime,
	"gender_id"	integer,
	PRIMARY KEY("id" AUTOINCREMENT),
	CONSTRAINT "fk_genders_users" FOREIGN KEY("gender_id") REFERENCES "genders"("id")
);
CREATE TABLE IF NOT EXISTS "patients" (
	"id"	integer,
	"created_at"	datetime,
	"updated_at"	datetime,
	"deleted_at"	datetime,
	"first_name"	text,
	"last_name"	text,
	"birthday"	datetime,
	"weight"	integer,
	"height"	integer,
	"sex"	text,
	"blood_type"	text,
	"drug_allergy"	text,
	"chronicdisease"	text,
	"tel"	text,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "treatments" (
	"id"	integer,
	"created_at"	datetime,
	"updated_at"	datetime,
	"deleted_at"	datetime,
	"treatment_name"	text,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "tstatuses" (
	"id"	integer,
	"created_at"	datetime,
	"updated_at"	datetime,
	"deleted_at"	datetime,
	"t_status_name"	text,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "schedules" (
	"id"	integer,
	"created_at"	datetime,
	"updated_at"	datetime,
	"deleted_at"	datetime,
	"date"	DATE NOT NULL,
	"patient_id"	integer,
	"treatment_id"	integer,
	"tstatus_id"	integer,
	PRIMARY KEY("id" AUTOINCREMENT),
	CONSTRAINT "fk_tstatuses_schedule" FOREIGN KEY("tstatus_id") REFERENCES "tstatuses"("id"),
	CONSTRAINT "fk_patients_schedules" FOREIGN KEY("patient_id") REFERENCES "patients"("id"),
	CONSTRAINT "fk_treatments_schedule" FOREIGN KEY("treatment_id") REFERENCES "treatments"("id")
);
INSERT INTO "genders" ("id","created_at","updated_at","deleted_at","name") VALUES (1,'2024-09-04 10:42:39.0130807+07:00','2024-09-04 10:42:39.0130807+07:00',NULL,'Male'),
 (2,'2024-09-04 10:42:39.0156754+07:00','2024-09-04 10:42:39.0156754+07:00',NULL,'Female');
INSERT INTO "users" ("id","created_at","updated_at","deleted_at","first_name","last_name","email","password","birth_day","gender_id") VALUES (1,'2024-09-04 10:42:39.8455106+07:00','2024-09-04 10:42:39.8455106+07:00',NULL,'Software','Analysis','sa@gmail.com','$2a$14$oOv4GkLbJD29DqHpXl42FeaqLh/wuRosmbzIBfjIeBOenpAHAsQbm','1988-11-12 00:00:00+00:00',1);
INSERT INTO "patients" ("id","created_at","updated_at","deleted_at","first_name","last_name","birthday","weight","height","sex","blood_type","drug_allergy","chronicdisease","tel") VALUES (1,'2024-09-04 10:42:39.8455106+07:00','2024-09-04 10:42:39.8455106+07:00',NULL,'นรชาติ','ติวางวาย','2011-04-02 00:00:00+00:00',66,166,'Male','A','-','-','0000000000');
INSERT INTO "treatments" ("id","created_at","updated_at","deleted_at","treatment_name") VALUES (1,'2024-09-04 10:42:39.0172304+07:00','2024-09-04 10:42:39.0172304+07:00',NULL,'ขูดหินปูน'),
 (2,'2024-09-04 10:42:39.0193086+07:00','2024-09-04 10:42:39.0193086+07:00',NULL,'อุดฟัน'),
 (3,'2024-09-04 10:42:39.0208662+07:00','2024-09-04 10:42:39.0208662+07:00',NULL,'ถอนฟัน');
INSERT INTO "tstatuses" ("id","created_at","updated_at","deleted_at","t_status_name") VALUES (1,'2024-09-04 10:42:39.0229513+07:00','2024-09-04 10:42:39.0229513+07:00',NULL,'Pending'),
 (2,'2024-09-04 10:42:39.0250219+07:00','2024-09-04 10:42:39.0250219+07:00',NULL,'Done');
INSERT INTO "schedules" ("id","created_at","updated_at","deleted_at","date","patient_id","treatment_id","tstatus_id") VALUES (1,'2024-09-04 10:42:39.8569044+07:00','2024-09-04 10:42:39.8569044+07:00',NULL,'2024-09-05 00:00:00+07:00',1,1,1),
 (2,'2024-09-04 11:00:32.7940763+07:00','2024-09-04 11:00:32.7940763+07:00',NULL,'2024-09-05 00:00:00+07:00',1,1,1),
 (3,'2024-09-04 11:01:56.8392941+07:00','2024-09-04 11:01:56.8392941+07:00',NULL,'2024-09-05 00:00:00+00:00',1,1,1),
 (4,'2024-09-04 11:03:56.2090444+07:00','2024-09-04 11:03:56.2090444+07:00',NULL,'2024-09-05 00:00:00+07:00',1,1,1),
 (5,'2024-09-04 11:06:03.7215319+07:00','2024-09-04 11:06:03.7215319+07:00',NULL,'2024-09-06 00:00:00+07:00',1,1,1),
 (6,'2024-09-04 11:06:56.5519394+07:00','2024-09-04 11:06:56.5519394+07:00',NULL,'2024-09-04 00:00:00+07:00',1,1,1),
 (7,'2024-09-04 11:12:18.7601609+07:00','2024-09-04 11:12:18.7601609+07:00',NULL,'2024-09-07 00:00:00+00:00',1,2,1),
 (8,'2024-09-04 11:15:44.7365942+07:00','2024-09-04 11:15:44.7365942+07:00',NULL,'2024-09-07 00:00:00+00:00',1,3,1),
 (9,'2024-09-06 16:35:33.6002531+07:00','2024-09-06 16:35:33.6002531+07:00',NULL,'2024-09-06 00:00:00+07:00',1,1,1),
 (10,'2024-09-06 16:36:33.6235718+07:00','2024-09-06 16:36:33.6235718+07:00',NULL,'2024-09-10 00:00:00+00:00',1,3,1);
CREATE INDEX IF NOT EXISTS "idx_genders_deleted_at" ON "genders" (
	"deleted_at"
);
CREATE INDEX IF NOT EXISTS "idx_users_deleted_at" ON "users" (
	"deleted_at"
);
CREATE INDEX IF NOT EXISTS "idx_patients_deleted_at" ON "patients" (
	"deleted_at"
);
CREATE INDEX IF NOT EXISTS "idx_treatments_deleted_at" ON "treatments" (
	"deleted_at"
);
CREATE INDEX IF NOT EXISTS "idx_tstatuses_deleted_at" ON "tstatuses" (
	"deleted_at"
);
CREATE INDEX IF NOT EXISTS "idx_schedules_deleted_at" ON "schedules" (
	"deleted_at"
);
COMMIT;
