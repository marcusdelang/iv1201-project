package main

import (
	"database/sql"
	"fmt"
	"log"
	_ "mysql"
	"os"
)

const DUMPFILE = "database_dump.sql"	// target file
const NULLDATA = "REPLACEME"			// custom placeholder text to replace NULL values with

type NullString struct {
	sql.NullString
}

func main() {
	// placeholder local db
	db, err := sql.Open("mysql",
		"iv1201:leif@tcp(127.0.0.1:3306)/iv1201mysql")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	err = db.Ping()
	if err != nil {
		fmt.Println("DB not accessible!")
		log.Fatal(err)
	}

	// remove previous and create new dump file
	os.Remove(DUMPFILE)
	os.Create(DUMPFILE)

	readTableContent(db)
}

func readTableContent(db *sql.DB) {
	// call the db and for each table read each row
		// for each row write to file
	migrateRole(db)
	migratePerson(db)
	migrateAvailability(db)
	migrateCompetence(db)
	migrateCompetenceProfile(db)
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
			person_id, ssn, role_id, name, surname, email, password, username NullString
		)
		err := rows.Scan(&person_id, &name, &surname, &ssn, &email, &password, &role_id, &username)
		if err != nil {
			log.Fatal(err)
		}

		if person_id.Valid != true { person_id.String = NULLDATA }
		if ssn.Valid != true { ssn.String = NULLDATA }
		if role_id.Valid != true { role_id.String = NULLDATA }
		if name.Valid != true { name.String = NULLDATA }
		if surname.Valid != true { surname.String = NULLDATA }
		if email.Valid != true { email.String = NULLDATA }
		if password.Valid != true { password.String = NULLDATA }
		if username.Valid != true { username.String = NULLDATA }

		fmt.Println(person_id.String, name.String,
			surname.String, ssn.String, email.String,
			password.String, role_id.String, username.String)
		row := "INSERT INTO person (person_id, name, " +
			"surname, " +
			"ssn, email, password, " +
			"role_id, username) VALUES (" + person_id.String + ", '" + name.String + "', '" +
			surname.String +"', '" + ssn.String + "', '" + email.String + "', '" +
			password.String +"', " + role_id.String + ", '" + username.String + "');"
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
		output := "INSERT INTO availability (availabilty_id, person_id, from_date, to_date) VALUES (" +
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

/**

DONE set up test DB - leifscript++
TODO fix proper statement
TODO take row data and write as INSERT statements
TODO check so all types have correct INSERT '' or lack of those for type, see e.g. ssn for person which is varchar
 */

