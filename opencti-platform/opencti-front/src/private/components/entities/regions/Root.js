import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { Route, Redirect, withRouter } from 'react-router-dom';
import graphql from 'babel-plugin-relay/macro';
import {
  QueryRenderer,
  requestSubscription,
} from '../../../../relay/environment';
import TopBar from '../../nav/TopBar';
import Region from './Region';
import RegionReports from './RegionReports';
import RegionKnowledge from './RegionKnowledge';
import RegionObservables from './RegionObservables';
import StixDomainObjectHeader from '../../common/stix_domain_objects/StixDomainObjectHeader';
import FileManager from '../../common/files/FileManager';
import RegionPopover from './RegionPopover';
import Loader from '../../../../components/Loader';
import StixCoreObjectHistory from '../../common/stix_core_objects/StixCoreObjectHistory';

const subscription = graphql`
  subscription RootRegionsSubscription($id: ID!) {
    stixDomainObject(id: $id) {
      ... on Region {
        ...Region_region
        ...RegionEditionContainer_region
      }
      ...FileImportViewer_entity
      ...FileExportViewer_entity
    }
  }
`;

const regionQuery = graphql`
  query RootRegionQuery($id: String!) {
    region(id: $id) {
      id
      name
      x_opencti_aliases
      ...Region_region
      ...RegionReports_region
      ...RegionKnowledge_region
      ...RegionObservables_region
      ...FileImportViewer_entity
      ...FileExportViewer_entity
    }
    connectorsForExport {
      ...FileManager_connectorsExport
    }
  }
`;

class RootRegion extends Component {
  componentDidMount() {
    const {
      match: {
        params: { regionId },
      },
    } = this.props;
    const sub = requestSubscription({
      subscription,
      variables: { id: regionId },
    });
    this.setState({ sub });
  }

  componentWillUnmount() {
    this.state.sub.dispose();
  }

  render() {
    const {
      me,
      match: {
        params: { regionId },
      },
    } = this.props;
    return (
      <div>
        <TopBar me={me || null} />
        <QueryRenderer
          query={regionQuery}
          variables={{ id: regionId }}
          render={({ props }) => {
            if (props && props.region) {
              return (
                <div>
                  <Route
                    exact
                    path="/dashboard/entities/regions/:regionId"
                    render={(routeProps) => (
                      <Region {...routeProps} region={props.region} />
                    )}
                  />
                  <Route
                    exact
                    path="/dashboard/entities/regions/:regionId/reports"
                    render={(routeProps) => (
                      <RegionReports {...routeProps} region={props.region} />
                    )}
                  />
                  <Route
                    exact
                    path="/dashboard/entities/regions/:regionId/knowledge"
                    render={() => (
                      <Redirect
                        to={`/dashboard/entities/regions/${regionId}/knowledge/overview`}
                      />
                    )}
                  />
                  <Route
                    path="/dashboard/entities/regions/:regionId/knowledge"
                    render={(routeProps) => (
                      <RegionKnowledge {...routeProps} region={props.region} />
                    )}
                  />
                  <Route
                    path="/dashboard/entities/regions/:regionId/observables"
                    render={(routeProps) => (
                      <RegionObservables
                        {...routeProps}
                        region={props.region}
                      />
                    )}
                  />
                  <Route
                    exact
                    path="/dashboard/entities/regions/:regionId/files"
                    render={(routeProps) => (
                      <React.Fragment>
                        <StixDomainObjectHeader
                          stixDomainObject={props.region}
                          PopoverComponent={<RegionPopover />}
                        />
                        <FileManager
                          {...routeProps}
                          id={regionId}
                          connectorsExport={props.connectorsForExport}
                          entity={props.region}
                        />
                      </React.Fragment>
                    )}
                  />
                  <Route
                    exact
                    path="/dashboard/entities/regions/:regionId/history"
                    render={(routeProps) => (
                      <React.Fragment>
                        <StixDomainObjectHeader
                          stixDomainObject={props.region}
                          PopoverComponent={<RegionPopover />}
                        />
                        <StixCoreObjectHistory
                          {...routeProps}
                          entityId={regionId}
                        />
                      </React.Fragment>
                    )}
                  />
                </div>
              );
            }
            return <Loader />;
          }}
        />
      </div>
    );
  }
}

RootRegion.propTypes = {
  children: PropTypes.node,
  match: PropTypes.object,
  me: PropTypes.object,
};

export default withRouter(RootRegion);
