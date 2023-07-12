import React, { useRef, useEffect } from "react";
import useWindowSize from "../utils/useWindowSize";

const { tableau } = window;

const BasicEmbed = () => {
  const tableauRef = useRef(null);
  const windowSize = useWindowSize();
  let viz = null;
  const url = "http://public.tableau.com/views/RegionalSampleWorkbook/Storms";

  const options = {
    hideToolbar: true,
    width: window.innerWidth,
    height: window.innerHeight,
    onFirstInteractive: () => {
      console.log("Run this code when the viz has finished loading.");

    },
  };
  const hide = () => {
    viz.hide();
  };
  const resizeFixedDashboard = (winsdowSize) => {
    console.log(window.innerHeight, window.innerWidth);
    let sheets = viz.getWorkbook().getActiveSheet();
    sheets.changeSizeAsync({
      behavior: "EXACTLY",
      maxSize: {
        height: winsdowSize.width,
        width: winsdowSize.height,
      },
    });
  };

  const exportPDF = () => {
    viz.showExportPDFDialog();
  };

  const exportImage = () => {
    viz.showExportImageDialog();
  };

  const selectMark = () => {
    viz
      .getWorkbook()
      .getActiveSheet()
      .getWorksheets()[0]
      .selectMarksAsync(
        "Storm Name",
        "IGOR",
        tableau.SelectionUpdateType.REPLACE
      );
  };

  const clearMark = () => {
    viz
      .getWorkbook()
      .getActiveSheet()
      .getWorksheets()[0]
      .clearSelectedMarksAsync();
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
  function getFilterNames() {


    viz.getWorkbook().getActiveSheet().getWorksheets().map(function (sheet) {
      console.log(sheet.getName())
      sheet.getFiltersAsync().then(function (filters) {
        filters.forEach(function (filter) {
          var filterName = filter.getFieldName();
          var selectedValue = filter.getAppliedValues().map(function (value) {
            return value.formattedValue;
          });

          console.log("Filter Name: " + filterName);
          console.log("Selected Value: " + selectedValue);

        });


      });
    })

  }

  const yearFilter = (event) => {
    const workbook = viz.getWorkbook();
    const activeSheet = workbook.getActiveSheet();
    const sheets = activeSheet.getWorksheets();
    console.log(sheets)
    sheets[0].applyFilterAsync(
      "YEAR(Date)",
      event.target.value,
      tableau.FilterUpdateType.REPLACE
    );
  };
  const onMarksSelection = (markEvent) => {
    getFilterNames();
    markEvent.getMarksAsync().then((marks) => {
      marks.map((mark) => {
        var pairs = mark.getPairs();
        pairs.map((pair) => {
          console.log(pair.fieldName);
          console.log(pair.formattedValue);
        });
      });
    });
  };
  const listenToMarkSelection = () => {
    viz.addEventListener(
      tableau.TableauEventName.MARKS_SELECTION,
      onMarksSelection
    );
  };

  const initTableau = () => {
    viz = new tableau.Viz(tableauRef.current, url, options);
  };

  useEffect(() => {
    initTableau();
    listenToMarkSelection();
    return () => {
      if (viz) {
        viz.dispose();
      }
    };
  }, [windowSize]);

  return (
    <>
      <button type="button" onClick={hide}>
        Hide
      </button>{" "}
      <button type="button" onClick={resizeFixedDashboard}>
        ResizeFixed
      </button>{" "}
      <button type="button" onClick={exportPDF}>
        Export to PDF
      </button>{" "}
      <button type="button" onClick={exportImage}>
        Export to Image
      </button>{" "}
      <button type="button" onClick={getData}>
        Get Data
      </button>{" "}
      <button type="button" onClick={selectMark}>
        show selected data
      </button>{" "}
      <button type="button" onClick={clearMark}>
        clear data
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
