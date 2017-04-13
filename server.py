# import falcon


import falcon


class IndexResource(object):
    def on_get(self, req, resp):
        resp.status = falcon.HTTP_200
        resp.content_type = 'text/html'
        with open('./index.html', 'r') as f:
            resp.body = f.read()


class StaticResource(object):
    def on_get(self, req, resp):
        resp.status = falcon.HTTP_200
        resp.content_type = 'appropriate/content-type'
        with open('.{0}'.format(req.path), 'r') as f:
            resp.body = f.read()


app = falcon.API()
app.add_sink(StaticResource().on_get, prefix='/static')
app.add_route('/', IndexResource())