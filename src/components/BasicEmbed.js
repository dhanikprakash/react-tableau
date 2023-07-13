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

  function getSheetData() {
    viz
      .getWorkbook()
      .getActiveSheet()
      .getWorksheets()
      .map(function (sheet) {
        console.log(sheet.getName());
        var sheetName = sheet.getName();

        sheet.getUnderlyingDataAsync().then(function (tableInfo) {
          var columns = tableInfo.getColumns();
          var columnNames = columns.map(function (column) {
            return column.getFieldName();
          });

          console.log("Sheet Name: " + sheetName);
          console.log("Column Names: " + columnNames);
        });
      });
  }

  function getFilterNames() {
    viz
      .getWorkbook()
      .getActiveSheet()
      .getWorksheets()
      .map(function (sheet) {
        console.log(sheet.getName());
        sheet.getFiltersAsync().then(function (filters) {
          filters.forEach(function (filter) {
            var filterName = filter.getFieldName();
            var filterType = filter.getFilterType();
            debugger;
            switch (filterType) {
              case tableau.FilterType.CATEGORICAL:
                getCategoricalFilterValues(filterName, filter);
                break;
              case tableau.FilterType.QUANTITATIVE:
                getQuantitativeFilterValues(filterName, filter);
                break;
              case tableau.FilterType.HIERARCHICAL:
                getHierarchicalFilterValues(filterName, filter);
                break;
              case tableau.FilterType.RELATIVE_DATE:
                getRelativeDateFilterValues(filterName, filter);
                break;
              default:
                console.log("Filter type not supported: " + filterType);
            }
          });
        });
      });
  }

  // Function to retrieve and display values for a categorical filter
  function getCategoricalFilterValues(filterName, filter) {
    console.log("Dhanik getCategoricalFilterValues: " + filterName);
    let filterValues = filter.getAppliedValues();

    filterValues.map(function (value) {
      console.log(value.formattedValue);
    });
  }

  // Function to retrieve and display values for a quantitative filter
  function getQuantitativeFilterValues(filterName, filter) {
    console.log("Dhanik getQuantitativeFilterValues: " + filterName);
    let filterRange = filter.getRange();

    var minValue = filterRange.min.formattedValue;
    var maxValue = filterRange.max.formattedValue;

    console.log(
      "Quantitative Filter - Name: " +
        filterName +
        ", Range: " +
        minValue +
        " to " +
        maxValue
    );
  }

  // Function to retrieve and display values for a hierarchical filter
  function getHierarchicalFilterValues(filterName, filter) {
    filter.getHierarchicalValuesAsync().then(function (filterValues) {
      var selectedValues = filterValues.map(function (value) {
        return value.formattedValue;
      });

      console.log(
        "Hierarchical Filter - Name: " +
          filterName +
          ", Values: " +
          selectedValues
      );
    });
  }

  // Function to retrieve and display values for a relative date filter
  function getRelativeDateFilterValues(filterName, filter) {
    var periodType = filter.getPeriod();
    var rangeN = filter.getRangeN();
    var rangeType = filter.getRangeType();

    console.log(
      "Relative Date Filter - Name: " +
        filterName +
        ", Period Type: " +
        periodType +
        ", Range N: " +
        rangeN +
        ", Range Type: " +
        rangeType
    );
  }
  const yearFilter = (event) => {
    const workbook = viz.getWorkbook();
    const activeSheet = workbook.getActiveSheet();
    const sheets = activeSheet.getWorksheets();
    console.log(sheets);
    sheets[0].applyFilterAsync(
      "YEAR(Date)",
      event.target.value,
      tableau.FilterUpdateType.REPLACE
    );
  };
  const onMarksSelection = (markEvent) => {
    markEvent.getMarksAsync().then(function (marks) {
      if (marks.length > 0) {
        var selectedField = marks[0].getPairs()[0];
        var fieldName = selectedField.fieldName;
        var formattedValue = selectedField.formattedValue;

        console.log("Field Name:", fieldName);
        console.log("Formatted Value:", formattedValue);
      }
    });

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
      <button type="button" onClick={getFilterNames}>
        Get Filter Names
      </button>{" "}
      <button type="button" onClick={getSheetData}>
        Get Sheet Data
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
