import React, { useRef, useEffect } from "react";

const { tableau } = window;

const BasicEmbed = () => {
  const tableauRef = useRef(null);
  let viz = null;
  const url = "http://public.tableau.com/views/RegionalSampleWorkbook/Storms";
  const options = {
    hideTabs: true,
    width: "100%",
    height: "90vh",
    onFirstInteractive: () => {
      console.log("Run this code when the viz has finished loading.");
    },
  };
  const hide = () => {
    viz.hide();
  };
  const show = () => {
    viz.show();
  };

  const exportPDF = () => {
    viz.showExportPDFDialog();
  };

  const exportImage = () => {
    viz.showExportImageDialog();
  };
  const reSize = () => {
    viz.setFrameSize(parseInt(500, 10), parseInt(500, 10));
  };

  const getData = () => {
    let options = {
      maxRows: 10,
      ignoreAliases: false,
      ignoreSelection: true,
      includeAllColumns: true,
    };

    viz
      .getWorkbook()
      .getActiveSheet()
      .getWorksheets()[0]
      .getUnderlyingDataAsync(options)
      .then((t) => {
        console.log(t.getData());
      });
  };

  const getFilter = () => {
    viz
      .getWorkbook()
      .getActiveSheet()
      .getWorksheets()[0]
      .getFiltersAsync()
      .then((x) => {
        x.map((item) => console.log(item.$4));
      });
  };

  const yearFilter = (event) => {
    const workbook = viz.getWorkbook();
    const activeSheet = workbook.getActiveSheet();
    const sheets = activeSheet.getWorksheets();
    sheets[0].applyFilterAsync(
      "YEAR(Date)",
      event.target.value,
      tableau.FilterUpdateType.REPLACE
    );
  };

  const initTableau = () => {
    viz = new tableau.Viz(tableauRef.current, url, options);
  };

  useEffect(() => {
    initTableau();
    return () => {
      if (viz) {
        viz.dispose();
      }
    };
  }, []);
  return (
    <>
      <button type="button" onClick={hide}>
        Hide-Tableau
      </button>{" "}
      <button type="button" onClick={show}>
        Show-Tableau
      </button>{" "}
      <button type="button" onClick={exportPDF}>
        Export to PDF
      </button>{" "}
      <button type="button" onClick={exportImage}>
        Export to Image
      </button>{" "}
      <button type="button" onClick={reSize}>
        Resize
      </button>{" "}
      <button type="button" onClick={getData}>
        Get Data
      </button>{" "}
      <button type="button" onClick={getFilter}>
        Get Filter Names
      </button>{" "}
      <div id="controls">
        Year:{" "}
        <select id="changeYear" onChange={yearFilter}>
          <option value="2010">2010</option>
          <option value="2011">2011</option>
          <option value="2012">2012</option>
        </select>
      </div>
      <div ref={tableauRef}>BasicEmbed</div>
    </>
  );
};

export default BasicEmbed;
