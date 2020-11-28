################################################################################
#
# This image implements a Node.js process as an unprivileged user in a hardened context.
#
# see: https://github.com/ellerbrock/docker-collection/tree/master/dockerfiles/alpine-harden
#
################################################################################
#
#  Install phase [ as installer ]
#
# Build image with NPM, etc.
FROM mhart/alpine-node:14.15.1 AS installer

ENV SERVICE_HOME /app

COPY . ${SERVICE_HOME}
WORKDIR ${SERVICE_HOME}

    # node custom/wj-customize-swaggerui && \
RUN apk --no-cache update && \
    apk --no-cache upgrade && \
    apk add --no-cache make gcc g++ python3 && \
    npm ci --only=production && \
    rm -f .npmrc

################################################################################
#
#  Release phase [ as release ]
#  Release image - no NPM, yarn, etc. & harden.sh applied
#
FROM mhart/alpine-node:slim-14.15.1 AS release

LABEL maintainer="admin@example.com"

ENV SERVICE_USER app
ENV SERVICE_HOME /app

RUN addgroup -S ${SERVICE_USER} && \
    adduser -h ${SERVICE_HOME} -s /bin/false -G ${SERVICE_USER} -S -g ${SERVICE_USER} ${SERVICE_USER}

COPY --from=installer --chown=${SERVICE_USER}:${SERVICE_USER} ${SERVICE_HOME} ${SERVICE_HOME}
WORKDIR ${SERVICE_HOME}

RUN apk --no-cache update && \
    apk --no-cache upgrade && \
    apk add --no-cache dumb-init && \
    ${SERVICE_HOME}/docker/harden.sh

USER ${SERVICE_USER}

EXPOSE 3000

ENTRYPOINT [ "/usr/bin/dumb-init", "--" ]

# With dumb-init as the entry point, node is not PID 1
CMD ["node", "--max-http-header-size=20480", "index.js" ]
