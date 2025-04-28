-- Drop database if exists (uncomment if needed)
-- DROP DATABASE IF EXISTS balance_sheet_tracker;

-- Create database
CREATE DATABASE balance_sheet_tracker;

-- Connect to the database
\c balance_sheet_tracker;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist
DROP TABLE IF EXISTS "liabilities";
DROP TABLE IF EXISTS "goals";
DROP TABLE IF EXISTS "assets";
DROP TABLE IF EXISTS "expenses";
DROP TABLE IF EXISTS "incomes";
DROP TABLE IF EXISTS "users";

-- Create tables
CREATE TABLE "users" (
    "id" serial PRIMARY KEY NOT NULL,
    "username" text NOT NULL,
    "password" text NOT NULL,
    "email" text NOT NULL,
    "googleId" text UNIQUE,
    "googleName" text,
    "googlePicture" text,
    "created_at" timestamp DEFAULT now() NOT NULL,
    "last_login" timestamp,
    CONSTRAINT "users_username_unique" UNIQUE("username"),
    CONSTRAINT "users_email_unique" UNIQUE("email")
);

CREATE TABLE "incomes" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "user_id" integer NOT NULL,
    "source" text NOT NULL,
    "category" text NOT NULL,
    "amount" numeric NOT NULL,
    "type" text NOT NULL,
    "frequency" text NOT NULL,
    "notes" text,
    "created_at" timestamp DEFAULT now() NOT NULL,
    CONSTRAINT "incomes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
);

CREATE TABLE "expenses" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "user_id" integer NOT NULL,
    "category" text NOT NULL,
    "amount" numeric NOT NULL,
    "description" text NOT NULL,
    "date" timestamp NOT NULL,
    "notes" text,
    "created_at" timestamp DEFAULT now() NOT NULL,
    CONSTRAINT "expenses_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
);

CREATE TABLE "assets" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "user_id" integer NOT NULL,
    "name" text NOT NULL,
    "category" text NOT NULL,
    "value" numeric NOT NULL,
    "income_generated" numeric NOT NULL,
    "notes" text,
    "created_at" timestamp DEFAULT now() NOT NULL,
    CONSTRAINT "assets_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
);

CREATE TABLE "liabilities" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "user_id" integer NOT NULL,
    "description" text NOT NULL,
    "type" text NOT NULL,
    "amount" numeric NOT NULL,
    "interest_rate" numeric NOT NULL,
    "notes" text,
    "created_at" timestamp DEFAULT now() NOT NULL,
    CONSTRAINT "liabilities_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
);

CREATE TABLE "goals" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "user_id" integer NOT NULL,
    "description" text NOT NULL,
    "target_amount" numeric NOT NULL,
    "current_amount" numeric NOT NULL,
    "target_date" date NOT NULL,
    "created_at" timestamp DEFAULT now() NOT NULL,
    CONSTRAINT "goals_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
); 