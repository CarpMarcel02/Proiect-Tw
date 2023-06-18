const pool = require("../database/connection");

exports.addInfractiuniFilter = async (filterData, email) => {
  const { categorie, an, tip, reprezentare } = filterData;

  const checkQueryText = `
    SELECT * FROM filtru_confiscari
    WHERE confiscari_subcategorie = $1
    AND confiscari_an = $2
    AND tip = $3
    AND reprezentare = $4
    AND email = $5
  `;
  const checkValues = [categorie, an, tip, reprezentare, email];

  try {
    const checkResult = await pool.query(checkQueryText, checkValues);

    if (checkResult.rows.length > 0) {
      return null;
    }

    const insertQueryText =
      "INSERT INTO filtru_confiscari (confiscari_subcategorie, confiscari_an, tip, reprezentare, email) VALUES ($1, $2, $3, $4, $5) RETURNING *";
    const insertValues = [categorie, an, tip, reprezentare, email];
    const result = await pool.query(insertQueryText, insertValues);
    return result.rows[0];
  } catch (err) {
    console.error(err);
    throw err;
  }
};
exports.getUrgenteByFilter = async (urgenteData) => {
  const { urgente_an, urgente_drog, urgente_filtru } = urgenteData;
  const allowedDrogs = ["canabis", "stimulanti", "opioide", "nsp"];

  if (!allowedDrogs.includes(urgente_drog)) {
    throw new Error(`Invalid drug: ${urgente_drog}`);
  }
  const queryText = {
    text: `SELECT categorie, ${urgente_drog} FROM urgente WHERE an=$1 AND filtru=$2`,
    values: [urgente_an, urgente_filtru],
  };

  const result = await pool.query(queryText);
  const urgente = result.rows.map((row) => {
    return {
      label: row.categorie,
      drog: urgente_drog,
      cantitate: row[urgente_drog],
    };
  });

  return urgente;
};
exports.getUrgenteIntervalBd = async (urgenteData) => {
  const {
    startYear,
    urgente_drog,
    gen_filtru,
    consum_filtru,
    diagnostic_filtru,
    varsta_filtru,
    administrare_filtru,
    endYear,
  } = urgenteData;
  const allowedDrogs = ["canabis", "stimulanti", "opioide", "nsp"];

  if (!allowedDrogs.includes(urgente_drog)) {
    throw new Error(`Invalid drug: ${urgente_drog}`);
  }
  let filtru =
    gen_filtru ||
    consum_filtru ||
    diagnostic_filtru ||
    varsta_filtru ||
    administrare_filtru;

  const queryText = {
    text: `SELECT an, filtru, ${urgente_drog} FROM urgente WHERE an BETWEEN $1 AND $2 AND categorie=$3`,
    values: [startYear, endYear, filtru],
  };

  const result = await pool.query(queryText);
  const urgente = result.rows.map((row) => {
    return {
      label: row["an"],
      cantitate: row[urgente_drog],
    };
  });

  return urgente;
};

exports.getConfiscariIntervalBd = async (confiscariDate) => {
  const {
    confiscari_subcategorie,
    drog,
    endYearConfiscari,
    startYearConfiscari,
  } = confiscariDate;
  const allowed = ["comprimate", "grame", "doze", "mililitri", "nr_capturi"];

  if (!allowed.includes(confiscari_subcategorie)) {
    throw new Error(`Invalid drug: ${confiscari_subcategorie}`);
  }
  const queryText = {
    text: `SELECT an, ${confiscari_subcategorie} FROM confiscari WHERE an BETWEEN $1 AND $2 AND drog=$3`,
    values: [startYearConfiscari, endYearConfiscari, drog],
  };

  const result = await pool.query(queryText);
  const confiscari = result.rows.map((row) => {
    return {
      label: row["an"],
      cantitate: Math.floor(row[confiscari_subcategorie]),
    };
  });
  return confiscari;
};