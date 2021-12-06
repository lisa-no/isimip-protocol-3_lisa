import React, { Component} from 'react'
import PropTypes from 'prop-types'

import { GroupToggleLink, filterRows, filterField } from '../../utils'

const ClimateVariableTable = function({ config, number, rows, groups, actions }) {
  const filteredRows = filterRows(config, rows)

  const getSpecifier = (row) => {
      if (row.extension) {
        if (Array.isArray(row.extension)) {
          return row.extension.map(extension => {
            if (extension === null) {
              return row.specifier
            } else {
              return row.specifier + '-' + extension
            }
          }).join(', ')
        } else {
          return row.specifier + '-' + row.extension
        }
      } else {
        return row.specifier
      }
  }

  const getResolutions = (row) => {
    if (Array.isArray(row.resolution)) {
      return row.resolution.map((resolution, index) => <li key={index}>{resolution}</li>)
    } else {
      return <li>{row.resolution}</li>
    }
  }

  return (
    <div className="w-100">
      <table className="table table-bordered table-fixed">
        <caption>
          Table {number}: Climate forcing variables for {config.simulation_round} simulations (<code>climate-variable</code>).
        </caption>
        <thead className="thead-dark">
          <tr>
            <th style={{width: '30%'}}>Variable</th>
            {
              config.simulation_round.endsWith('a') && <React.Fragment>
                <th style={{width: '10%'}}>Variable specifier</th>
                <th style={{width: '10%'}}>Unit</th>
                <th style={{width: '10%'}}>Resolution</th>
                <th style={{width: '40%'}}>Datasets</th>
              </React.Fragment>
            }
            {
              config.simulation_round.endsWith('b') && <React.Fragment>
                <th style={{width: '20%'}}>Variable specifier</th>
                <th style={{width: '15%'}}>Unit</th>
                <th style={{width: '15%'}}>Resolution</th>
                <th style={{width: '20%'}}>Models</th>
              </React.Fragment>
            }
          </tr>
        </thead>
        <tbody>
          {
            groups.map(group => {
              const groupRows = filteredRows.filter(row => row.group == group.specifier)
              const groupClosed = !config.groups.includes(group.specifier)
              const groupToggle = () => {
                if (closed) actions.toggleTable('climate_variable')
                actions.toggleGroup(group.specifier)
              }

              if (groupRows.length > 0) {
                const groupHeader = [
                  <tr key="-1">
                    <td colSpan="5" className="table-secondary">
                      <GroupToggleLink className="float-right" closed={groupClosed} toggle={groupToggle}/>
                      <strong>{group.title}</strong>
                      {' '}
                      {group.mandatory && <span className="badge badge-info">mandatory</span>}
                    </td>
                  </tr>
                ]

                if (groupClosed) {
                  return groupHeader
                } else {
                  return groupHeader.concat(
                    groupRows.map((row, index) => {
                      return (
                        <tr key={index}>
                          <td>
                            <p>
                              {row.long_name}
                            </p>
                          </td>
                          <td><strong>{getSpecifier(row)}</strong></td>
                          <td>{row.unit}</td>
                          <td>
                            <ul>
                              {getResolutions(row)}
                            </ul>
                          </td>
                          <td>
                            <ul>
                              {filterField(config, row.climate_forcing).map((value, idx) => <li key={idx}>{value}</li>)}
                            </ul>
                          </td>
                        </tr>
                      )
                    })
                  )
                }
              }
            })
          }
        </tbody>
      </table>
    </div>
  )
}

ClimateVariableTable.propTypes = {
  config: PropTypes.object.isRequired,
  number: PropTypes.string.isRequired,
  rows: PropTypes.array.isRequired,
  groups: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired
}

export default ClimateVariableTable
