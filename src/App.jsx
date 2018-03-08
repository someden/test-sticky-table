import React, { Component } from 'react';
import { Set } from 'immutable';

import data from './data.json';

class App extends Component {
  state = {
    columnsHeadersByGroups: [],
    rowsByGroups: [],
    openedRowsGroups: Set(),
  };

  componentDidMount() {
    this.getColumnsHeadersByGroups();
    this.getRowsByGroups();
  }

  getColumnsHeadersByGroups = () =>
    this.setState({ columnsHeadersByGroups: data.columnsHeadersByGroups });

  getRowsByGroups = () => this.setState({ rowsByGroups: data.rowsByGroups });

  renderColgroups = columnsHeadersGroups => [
    <colgroup key='colgroup' span='1' />,
    ...columnsHeadersGroups.map(({ id, headers }) => (
      <colgroup key={`colgroup_${id}`} span={headers.length} className='border-left border-right' />
    )),
  ];

  renderColumnsHeadersGroups = columnsHeadersGroups => (
    <tr>
      <th className='sticky-left bg-white border-bottom-0' style={{ zIndex: 2 }} />
      {columnsHeadersGroups.map(({ id, name, headers }) => (
        <th
          key={`columnsHeadersGroup_${id}`}
          colSpan={headers.length}
          className='text-center bg-white border-bottom-0'
        >
          {name}
        </th>
      ))}
    </tr>
  );

  renderColumnsHeaders = columnsHeadersByGroups => (
    <tr>
      <th className='sticky-left bg-white border-top-0' style={{ top: '3em', zIndex: 2 }}>
        Балансодержатель
      </th>
      {columnsHeadersByGroups.reduce(
        (acc, { headers }) => [
          ...acc,
          ...headers.map(({ id, name }) => (
            <th
              key={`columnHeader_${id}`}
              className='text-center bg-white border-top-0'
              style={{ top: '3em' }}
            >
              {name}
            </th>
          )),
        ],
        []
      )}
    </tr>
  );

  renderRowsGroups = (rowsGroups, columnsCount) =>
    rowsGroups.reduce(
      (acc, { id, name, rows }) => [
        ...acc,
        <tr key={`rowsGroup_${id}`}>
          <th className='sticky-left bg-white text-nowrap'>
            <button className='btn btn-light btn-sm' onClick={this.handleToggleRowsGroup(id)}>
              {this.state.openedRowsGroups.has(id) ? '−' : '+'}
            </button>{' '}
            <b>{name}</b>
          </th>
          <td colSpan={columnsCount} />
        </tr>,
        ...(this.state.openedRowsGroups.has(id) ? this.renderRows(rows) : []),
      ],
      []
    );

  handleToggleRowsGroup = id => () =>
    this.setState({
      openedRowsGroups: this.state.openedRowsGroups.has(id)
        ? this.state.openedRowsGroups.delete(id)
        : this.state.openedRowsGroups.add(id),
    });

  renderRows = rows =>
    rows.map(({ id, name, cells }) => (
      <tr key={`row_${id}`}>
        <th className='sticky-left bg-white'>{name}</th>
        {cells.map(cell => (
          <td key={`cell_${cell.id}`} className='text-center'>
            {cell.value}
          </td>
        ))}
      </tr>
    ));

  render() {
    const { columnsHeadersByGroups, rowsByGroups } = this.state;

    const columnsCount = columnsHeadersByGroups.reduce(
      (acc, { headers }) => acc + headers.length,
      0
    );

    return (
      <div className='full-viewport'>
        <table className='table table-hover table-hover-column sticky-header mb-0'>
          {this.renderColgroups(columnsHeadersByGroups)}
          <thead>
            {this.renderColumnsHeadersGroups(columnsHeadersByGroups)}
            {this.renderColumnsHeaders(columnsHeadersByGroups)}
          </thead>
          <tbody>{this.renderRowsGroups(rowsByGroups, columnsCount)}</tbody>
        </table>
      </div>
    );
  }
}

export default App;
