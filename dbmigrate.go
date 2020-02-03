package main

import (
	"database/sql"
	"fmt"
	"log"
	_ "mysql"
	"os"
)

const DUMPFILE = "database_dump.sql"	// target file
const NULLDATA = "REPLACEME"	// custom placeholder text to replace NULL values

type NullString struct {
	sql.NullString
}

func main() {
	USER := os.Getenv("IV1201_DB_USER")
	PW := os.Getenv("IV1201_DB_PW")
	PROTOCOL := os.Getenv("IV1201_DB_PROTOCOL")
	IP := os.Getenv("IV1201_DB_IP")
	DBNAME := os.Getenv("IV1201_DB_NAME")

	db, err := sql.Open("mysql", USER+":"+PW+"@"+PROTOCOL+"("+IP+")/"+DBNAME)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	err = db.Ping()
	if err != nil {
		fmt.Println("DB not accessible!")
		log.Fatal(err)
	}

	err = os.Remove(DUMPFILE)
	if err != nil {
		log.Println("No previous dump file found to overwrite")
	}

	_, err = os.Create(DUMPFILE)
	if err != nil {
		log.Fatal(err)
	}

	readTableContent(db)
}

func readTableContent(db *sql.DB) {
	err := migrateRole(db)
	if err != nil {
		log.Fatal(err)
	}
	err = migratePerson(db)
	if err != nil {
		log.Fatal(err)
	}
	err = migrateAvailability(db)
	if err != nil {
		log.Fatal(err)
	}
	err = migrateCompetence(db)
	if err != nil {
		log.Fatal(err)
	}
	err = migrateCompetenceProfile(db)
	if err != nil {
		log.Fatal(err)
	}
}

func migrateRole(db *sql.DB) error {
	rows, err := db.Query("SELECT role_id, `name` from role")
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()

	for rows.Next() {
		var (
			role_id, name NullString
		)
		err := rows.Scan(&role_id, &name)
		if err != nil {
			log.Fatal(err)
		}

		if role_id.Valid != true { role_id.String = NULLDATA }
		if name.Valid != true { name.String = NULLDATA }

		fmt.Println(role_id.String, name.String)
		output := "INSERT INTO role (role_id, name) VALUES (" + role_id.String + ", '" + name.String + "');"
		writeToFile(output)
	}
	if err := rows.Err(); err != nil {
		log.Fatal(err)
	}
	return nil
}

func migratePerson(db *sql.DB) error {
	rows, err := db.Query("SELECT `person_id`, `name`, `surname`, ssn, `email`, `password`, role_id, `username` from person")
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()

	for rows.Next() {
		var (
			person_id, name, surname, ssn, email, password, role_id, username NullString
		)
		err := rows.Scan(&person_id, &name, &surname, &ssn, &email, &password, &role_id, &username)
		if err != nil {
			log.Fatal(err)
		}

		// TODO consider if handling lack of data should be done more explicitly
		if person_id.Valid != true { person_id.String = NULLDATA }
		if name.Valid != true { name.String = NULLDATA }
		if surname.Valid != true { surname.String = NULLDATA }
		if ssn.Valid != true { ssn.String = NULLDATA }
		if email.Valid != true { email.String = NULLDATA }
		if password.Valid != true { password.String = NULLDATA }
		if role_id.Valid != true { role_id.String = NULLDATA }
		if username.Valid != true { username.String = NULLDATA }

		fmt.Println(person_id.String, name.String, surname.String, ssn.String,
			email.String, password.String, role_id.String, username.String)

		row := "INSERT INTO person (person_id, name, surname, ssn, email, password, role_id, username) VALUES (" +
			person_id.String + ", '" + name.String + "', '" + surname.String +"', '" + ssn.String + "', '" +
			email.String + "', '" + password.String +"', " + role_id.String + ", '" + username.String + "');"
		writeToFile(row)
	}
	if err := rows.Err(); err != nil {
		log.Fatal(err)
	}
	return nil
}

func migrateAvailability(db *sql.DB) error {
	rows, err := db.Query("SELECT availability_id, person_id, `from_date`, `to_date` from availability")
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()

	for rows.Next() {
		var (
			availability_id, person_id, from_date, to_date NullString
		)
		err := rows.Scan(&availability_id, &person_id, &from_date, &to_date)
		if err != nil {
			log.Fatal(err)
		}

		if availability_id.Valid != true { availability_id.String = NULLDATA }
		if person_id.Valid != true { person_id.String = NULLDATA }
		if from_date.Valid != true { from_date.String = NULLDATA }
		if to_date.Valid != true { to_date.String = NULLDATA }

		fmt.Println(availability_id.String, person_id.String, from_date.String, to_date.String)

		output := "INSERT INTO availability (availability_id, person_id, from_date, to_date) VALUES (" +
			availability_id.String + ", " + person_id.String + ", '" + from_date.String + "', '"+ to_date.String + "');"
		writeToFile(output)
	}
	if err := rows.Err(); err != nil {
		log.Fatal(err)
	}
	return nil
}

func migrateCompetence(db *sql.DB) error {
	rows, err := db.Query("SELECT competence_id, `name` from competence")
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()

	for rows.Next() {
		var (
			competence_id, name NullString
		)
		err := rows.Scan(&competence_id, &name)
		if err != nil {
			log.Fatal(err)
		}

		if competence_id.Valid != true { competence_id.String = NULLDATA }
		if name.Valid != true { name.String = NULLDATA }

		fmt.Println(competence_id.String, name.String)

		output := "INSERT INTO competence (competence_id, name) VALUES (" + competence_id.String + ", '" + name.String + "');"
		writeToFile(output)
	}
	if err := rows.Err(); err != nil {
		log.Fatal(err)
	}
	return nil
}

func migrateCompetenceProfile(db *sql.DB) error {
	rows, err := db.Query("SELECT competence_profile_id, person_id, competence_id, years_of_experience from competence_profile")
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()

	for rows.Next() {
		var (
			competence_profile_id, person_id, competence_id, years_of_experience NullString
		)
		err := rows.Scan(&competence_profile_id, &person_id, &competence_id, &years_of_experience)
		if err != nil {
			log.Fatal(err)
		}

		if competence_profile_id.Valid != true { competence_profile_id.String = NULLDATA }
		if person_id.Valid != true { person_id.String = NULLDATA }
		if competence_id.Valid != true { competence_id.String = NULLDATA }
		if years_of_experience.Valid != true { years_of_experience.String = NULLDATA }

		fmt.Println(competence_profile_id.String, person_id.String, competence_id.String, years_of_experience.String)

		output := "INSERT INTO competence_profile (competence_profile_id, person_id, competence_id, years_of_experience) VALUES (" +
			competence_profile_id.String + ", " + person_id.String + ", " + competence_id.String + ", " + years_of_experience.String + ");"
		writeToFile(output)
	}
	if err := rows.Err(); err != nil {
		log.Fatal(err)
	}
	return nil
}

func writeToFile(input string) error {
	file, err := os.OpenFile(DUMPFILE, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
	if err != nil {
		log.Fatal(err)
	}
	defer file.Close()

	if _, err := file.WriteString(input + "\n"); err != nil {
		log.Fatal(err)
	}
	if err := file.Close(); err != nil {
		log.Fatal(err)
	}
	return nil
}
