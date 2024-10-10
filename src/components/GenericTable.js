import React, { useState, useEffect } from "react";
import { Table, Input, Button, Space, Popconfirm } from "antd";
import "../assets/styleSheets/GenericTable.css";

const GenericTable = ({ data, searchKeys, sortableColumns, actions, actionFunctions, filterableColumns }) => {
  const [filteredData, setFilteredData] = useState(data);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  // Handle Search Functionality
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    // Filter the data based on the search term and search keys
    const filtered = data.filter((item) =>
      searchKeys.some((key) => {
        const cellValue = item[key]?.toString().toLowerCase();
        return cellValue?.includes(value);
      })
    );
    setFilteredData(filtered);
  };

  // Generate unique values for each column to create filters dynamically
  const getUniqueValues = (key) => {
    const uniqueValues = [...new Set(data.map((item) => item[key]))]; // Get unique values
    return uniqueValues.map((value) => ({
      text: value?.toString(),
      value: value?.toString(),
    }));
  };

  // Handle Filter Functionality
  const handleFilter = (value, record, key) => {
    return record[key]?.toString() === value;
  };

  // Ensure the data array is not empty
  const columns = data && data.length > 0 ? Object.keys(data[0] || {}).map((key) => ({
    title: key.charAt(0).toUpperCase() + key.slice(1),
    dataIndex: key,
    key,
    sorter: sortableColumns.includes(key)
      ? (a, b) => {
          if (typeof a[key] === "string") {
            return a[key].localeCompare(b[key]);
          }
          return a[key] - b[key];
        }
      : null,
    // Apply filters only to specified filterableColumns
    filters: filterableColumns?.includes(key) ? getUniqueValues(key) : null,
    onFilter: filterableColumns?.includes(key) ? (value, record) => handleFilter(value, record, key) : null,
    width: 150, // Set a default width for each column
  })) : [];

  // Add an "Actions" column with Popconfirm for delete action
  if (actions && actionFunctions && actions.length === actionFunctions.length) {
    columns.push({
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Space size="middle">
          {actions.map((action, index) => {
            if (action.toLowerCase() === "delete") {
              return (
                <Popconfirm
                  key={action}
                  title="Are you sure to delete this item?"
                  onConfirm={() => actionFunctions[index](record)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button className={index % 2 === 0 ? "btn1" : "btn2"} type="link">
                    {action}
                  </Button>
                </Popconfirm>
              );
            } else if (action.toLowerCase() === "toggle-status") {
              return (
                <Popconfirm
                  key={action}
                  title="Are you sure to change the status of this item?"
                  onConfirm={() => actionFunctions[index](record)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button className={index % 2 === 0 ? "btn1" : "btn2"} type="link">
                    {action}
                  </Button>
                </Popconfirm>
              );
            } else {
              return (
                <Button
                  className={index % 2 === 0 ? "btn1" : "btn2"}
                  key={action}
                  type="link"
                  onClick={() => actionFunctions[index](record)}
                >
                  {action}
                </Button>
              );
            }
          })}
        </Space>
      ),
      width: (actions.length)*160, // Ensure width for action column
    });
  }

  return (
    <div className="generic-table-container">
      {/* Search Input */}
      <Input
        placeholder="Search..."
        value={searchTerm}
        onChange={handleSearch}
        className="search-input"
      />

      {/* Ant Design Table with dynamic filters */}
      <Table
        dataSource={filteredData}
        columns={columns}
        rowKey={(record) => record.userId} // Assuming each row has a unique 'userId' field
        pagination={{ pageSize: 10 }} // You can configure pagination here
        scroll={{ x: 1000, y: 700 }} // Set a large value for horizontal scroll
      />
    </div>
  );
};

export default GenericTable;
