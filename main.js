
function rangeCallBack(dateRange) {
    this.value = dateRange;
}

var dp = new CLEVERCLEVER.DateRangePicker();
dp.apply("input.cc_date_range_picker", rangeCallBack);
