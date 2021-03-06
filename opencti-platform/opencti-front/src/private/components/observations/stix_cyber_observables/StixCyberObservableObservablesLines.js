import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { interval } from 'rxjs';
import { pathOr } from 'ramda';
import { createPaginationContainer } from 'react-relay';
import graphql from 'babel-plugin-relay/macro';
import ListLinesContent from '../../../../components/list_lines/ListLinesContent';
import {
  StixCyberObservableObservableLine,
  StixCyberObservableObservableLineDummy,
} from './StixCyberObservableObservableLine';
import { TEN_SECONDS } from '../../../../utils/Time';

const interval$ = interval(TEN_SECONDS);

const nbOfRowsToLoad = 50;

class StixCyberObservableObservablesLines extends Component {
  componentDidMount() {
    this.subscription = interval$.subscribe(() => {
      this.props.relay.refetchConnection(25);
    });
  }

  componentWillUnmount() {
    this.subscription.unsubscribe();
  }

  render() {
    const {
      initialLoading,
      dataColumns,
      relay,
      entityLink,
      paginationOptions,
      displayRelation,
      entityId
    } = this.props;
    return (
      <div style={{ marginTop: -20 }}>
        <ListLinesContent
          initialLoading={initialLoading}
          loadMore={relay.loadMore.bind(this)}
          hasMore={relay.hasMore.bind(this)}
          isLoading={relay.isLoading.bind(this)}
          dataList={pathOr(
            [],
            ['stixCyberObservableRelationshipsOfElement', 'edges'],
            this.props.data,
          )}
          globalCount={pathOr(
            nbOfRowsToLoad,
            [
              'stixCyberObservableRelationshipsOfElement',
              'pageInfo',
              'globalCount',
            ],
            this.props.data,
          )}
          LineComponent={
            <StixCyberObservableObservableLine
              displayRelation={displayRelation}
            />
          }
          DummyLineComponent={
            <StixCyberObservableObservableLineDummy
              displayRelation={displayRelation}
            />
          }
          dataColumns={dataColumns}
          nbOfRowsToLoad={nbOfRowsToLoad}
          paginationOptions={paginationOptions}
          entityLink={entityLink}
          entityId={entityId}
        />
      </div>
    );
  }
}

StixCyberObservableObservablesLines.propTypes = {
  classes: PropTypes.object,
  paginationOptions: PropTypes.object,
  dataColumns: PropTypes.object.isRequired,
  data: PropTypes.object,
  relay: PropTypes.object,
  initialLoading: PropTypes.bool,
  entityId: PropTypes.string,
  entityLink: PropTypes.string,
  displayRelation: PropTypes.bool,
};

export const stixCyberObservableObservablesLinesQuery = graphql`
  query StixCyberObservableObservablesLinesPaginationQuery(
    $elementId: String
    $search: String
    $count: Int!
    $cursor: ID
    $orderBy: StixCyberObservableRelationshipsOrdering
    $orderMode: OrderingMode
  ) {
    ...StixCyberObservableObservablesLines_data
    @arguments(
      elementId: $elementId
      search: $search
      count: $count
      cursor: $cursor
      orderBy: $orderBy
      orderMode: $orderMode
    )
  }
`;

export default createPaginationContainer(
  StixCyberObservableObservablesLines,
  {
    data: graphql`
      fragment StixCyberObservableObservablesLines_data on Query
      @argumentDefinitions(
        elementId: { type: "String" }
        search: { type: "String" }
        count: { type: "Int", defaultValue: 25 }
        cursor: { type: "ID" }
        orderBy: { type: "StixCyberObservableRelationshipsOrdering" }
        orderMode: { type: "OrderingMode" }
      ) {
        stixCyberObservableRelationshipsOfElement(
          elementId: $elementId
          search: $search
          first: $count
          after: $cursor
          orderBy: $orderBy
          orderMode: $orderMode
        )
        @connection(
          key: "Pagination_stixCyberObservableRelationshipsOfElement"
        ) {
          edges {
            node {
              ...StixCyberObservableObservableLine_node
            }
          }
          pageInfo {
            endCursor
            hasNextPage
            globalCount
          }
        }
      }
    `,
  },
  {
    direction: 'forward',
    getConnectionFromProps(props) {
      return props.data && props.data.stixCyberObservableRelationships;
    },
    getFragmentVariables(prevVars, totalCount) {
      return {
        ...prevVars,
        count: totalCount,
      };
    },
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        elementId: fragmentVariables.fromId,
        search: fragmentVariables.search,
        count,
        cursor,
        orderBy: fragmentVariables.orderBy,
        orderMode: fragmentVariables.orderMode,
      };
    },
    query: stixCyberObservableObservablesLinesQuery,
  },
);
