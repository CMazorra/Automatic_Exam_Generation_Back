-- AlterTable
CREATE SEQUENCE sub_topic_id_seq;
ALTER TABLE "Sub_Topic" ALTER COLUMN "id" SET DEFAULT nextval('sub_topic_id_seq');
ALTER SEQUENCE sub_topic_id_seq OWNED BY "Sub_Topic"."id";
